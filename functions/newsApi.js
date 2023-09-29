require('dotenv').config()


const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*'
}

exports.handler = async (event, context) => {
  const API_KEY = process.env.NEWS_API_KEY
  let newsHeadlines

  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=br&apiKey=${API_KEY}`)
    newsHeadlines = await response.json()

  } catch (err) {
    console.error(err)
  }

  const { articles } = newsHeadlines

  // console.log(articles)

  let headlines = []

  articles.forEach(headline => {
    headlines.push({
      title: headline.title.split(" - ")[0],
      source: headline.author
    })
  })

  // console.log(headlines)


  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido', message: 'Este endpoint só suporta solicitações GET.' }),
      headers
    };
  } else return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ headlines })
  }
}