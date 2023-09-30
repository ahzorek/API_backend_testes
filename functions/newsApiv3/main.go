package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
  "math/rand"

	"github.com/PuerkitoBio/goquery"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type Article struct {
	Title  string `json:"title"`
	Href   string `json:"href"`
	Source string `json:"source"`
}

func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if request.HTTPMethod != "GET" {
		return events.APIGatewayProxyResponse{
			StatusCode: 405,
			Body:       `{"error":"Método não permitido","message":"Este endpoint só suporta solicitações GET."}`,
		}, nil
	}

	headlines, err := fetchHeadlines()
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error":"Erro ao buscar manchetes","message":"%v"}`, err),
		}, nil
	}

	// Embaralhar as manchetes aleatoriamente
	rand.Shuffle(len(headlines), func(i, j int) {
		headlines[i], headlines[j] = headlines[j], headlines[i]
	})

	response := struct {
		Headlines []Article `json:"headlines"`
		Size      int       `json:"size"`
	}{Headlines: headlines, Size: len(headlines)}

	responseBody, err := json.Marshal(response)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"error":"Erro de serialização JSON","message":"%v"}`, err),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                "application/json; charset=utf-8",
			"Access-Control-Allow-Origin": "*",
      "Cache-Control":               "public, max-age=3600", //60 vezes 60segundos = 1h
		},
		Body: string(responseBody),
	}, nil
}

func fetchHeadlines() ([]Article, error) {
	var headlines []Article

	globoComTopHeadlines, err := getGloboComTopHeadlines()
	if err != nil {
		return nil, err
	}
	headlines = append(headlines, globoComTopHeadlines...)

	uolMaisLidas, err := getUOLMaisLidas()
	if err != nil {
		return nil, err
	}
	headlines = append(headlines, uolMaisLidas...)

	brasil247, err := getBrasil247()
	if err != nil {
		return nil, err
	}
	headlines = append(headlines, brasil247...)

	cnnBrasilTecnologia, err := getCNNBrasil("tecnologia")
	if err != nil {
		return nil, err
	}
	headlines = append(headlines, cnnBrasilTecnologia...)

	cnnBrasilNoticias, err := getCNNBrasil("politica")
	if err != nil {
		return nil, err
	}
	headlines = append(headlines, cnnBrasilNoticias...)

	bbcBrasil, err := getBBCBrasil()
	if err != nil {
		return nil, err
	}
	headlines = append(headlines, bbcBrasil...)

	return headlines, nil
}
//executa função principal
func main() {
	lambda.Start(Handler)
}

//funções de busca das headlines em cada site
func getGloboComTopHeadlines() ([]Article, error) {
	res, err := http.Get("https://globo.com")
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, err
	}

	var headlines []Article
	doc.Find(".topglobocom__ranking__content-item").Each(func(i int, s *goquery.Selection) {
		title := s.Text()
		href, _ := s.Find(".post__link").Attr("href")
		headlines = append(headlines, Article{Title: title, Href: href, Source: "Globo.com"})
	})

	return headlines, nil
}

func getUOLMaisLidas() ([]Article, error) {
	res, err := http.Get("https://www.uol.com.br")
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, err
	}

	var headlines []Article
	doc.Find(".mostRead__item").Each(func(i int, s *goquery.Selection) {
		rawTitle := s.Find("h3").Text()
		title := strings.TrimSpace(rawTitle)
		href, _ := s.Find("a").Attr("href")
		headlines = append(headlines, Article{Title: title, Href: href, Source: "UOL"})
	})

	return headlines, nil
}

func getBrasil247() ([]Article, error) {
	res, err := http.Get("https://www.brasil247.com/ultimas-noticias")
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, err
	}

	var headlines []Article
	doc.Find(".articleGrid__item").Each(func(i int, s *goquery.Selection) {
		title := s.Find("h3").Text()
		href := s.Find("h3 a").AttrOr("href", "")
		headlines = append(headlines, Article{Title: title, Href: href, Source: "Brasil247"})
	})
	headlines = headlines[1:] // Ignorar o primeiro item

	return headlines, nil
}

func getCNNBrasil(section string) ([]Article, error) {
	url := fmt.Sprintf("https://www.cnnbrasil.com.br/%s/", section)
	res, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, err
	}

	h2title := doc.Find(".home__category").Text()

	var headlines []Article
	doc.Find(".home__list__item").Each(func(i int, s *goquery.Selection) {
		title := s.Find("a h3").Text()
		href, _ := s.Find("a").Attr("href")
		headlines = append(headlines, Article{Title: title, Href: href, Source: fmt.Sprintf("CNN Brasil - %s", h2title)})
	})

	return headlines, nil
}

func getBBCBrasil() ([]Article, error) {
	res, err := http.Get("https://www.bbc.com/portuguese/topics/cz74k717pw5t")
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, err
	}

	var headlines []Article
	doc.Find("[data-testid='topic-promos'] li").Each(func(i int, s *goquery.Selection) {
		title := s.Find("h2").Text()
		href, _ := s.Find("h2 a").Attr("href")
		headlines = append(headlines, Article{Title: title, Href: href, Source: "BBC Brasil"})
	})

	return headlines, nil
}
