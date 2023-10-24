require('dotenv').config()
const cheerio = require('cheerio');

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*'
}
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido', message: 'Este endpoint só suporta solicitações GET.' }),
      headers
    }
  } else
    try {
      const globoComTopHeadlines = await getGloboComTopHeadlines()
      const uolMaisLidas = await getUOLMaisLidas()
      const brasil247 = await getBrasil247()
      const cnnBrasilTecnologia = await getCNNBrasil()
      const cnnBrasilNoticias = await getCNNBrasil('politica')
      const bbcBrasil = await getBBCBrasil()

      let AGGNEWS = [
        ...globoComTopHeadlines,
        ...cnnBrasilNoticias,
        ...brasil247,
        ...bbcBrasil,
        ...uolMaisLidas,
        ...cnnBrasilTecnologia
      ]

      const headlines = AGGNEWS.sort(() => Math.random() - 0.5)

      return {
        statusCode: 200,
        headers,
        'Cache-Control': 'public, s-maxage=7200',
        body: JSON.stringify({
          headlines, size: headlines.length
        })
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error }),
        headers
      }
    }
}

async function getGloboComTopHeadlines() {
  let content = []
  try {
    const res = await fetch('https://globo.com')
    const html = await res.text()
    const $ = cheerio.load(html)
    const topGloboCom = $('.topglobocom__ranking__content-item')

    topGloboCom.each((index, element) => {
      const title = $(element).text()
      const href = $(element).find('.post__link').attr('href')
      content.push({ title, href, source: 'Globo.com' })
    })
  } catch (error) {
    console.error(error)
  }
  return content
}

async function getUOLMaisLidas() {
  let content = []
  try {
    const res = await fetch('https://www.uol.com.br')
    const html = await res.text()
    const $ = cheerio.load(html)
    const mais_lidas_uol = $('.mostRead__item')

    mais_lidas_uol.each((index, element) => {
      const rawTitle = $(element).find('h3').text()
      const title = rawTitle.trim()
      const href = $(element).find('a').attr('href')
      content.push({
        title,
        href,
        source: 'UOL'
      })
    })
  } catch (error) {
    console.error(error)
  }
  return content
}

async function getBrasil247() {
  let content = []
  try {
    const res = await fetch('https://www.brasil247.com/ultimas-noticias')
    const html = await res.text()
    const $ = cheerio.load(html)
    const target = $('.articleGrid__item')

    target.each((index, element) => {
      const title = $(element).find('h3').text()
      const href = $(element).find('h3').find('a').attr('href')
      content.push({
        title,
        href,
        source: 'Brasil247'
      })
    })
    content = content.slice(1)
  } catch (error) {
    console.error(error)
  }
  return content
}

async function getCNNBrasil(section = 'tecnologia') {
  let content = []
  try {
    const res = await fetch(`https://www.cnnbrasil.com.br/${section}/`)
    const html = await res.text()
    const $ = cheerio.load(html)
    const target = $('.home__list__item')
    const h2title = $('.home__category').text()

    target.each((index, element) => {
      const title = $(element).find('a').find('h3').text()
      const href = $(element).find('a').attr('href')
      content.push({
        title,
        href,
        source: `CNN Brasil - ${h2title}`
      })
    })
  } catch (error) {
    console.error(error)
  }
  return content
}

async function getBBCBrasil() {
  let content = []
  try {
    const res = await fetch(`https://www.bbc.com/portuguese/topics/cz74k717pw5t`)
    const html = await res.text()
    const $ = cheerio.load(html)
    const target = $('[data-testid="topic-promos"]').find('li')

    target.each((index, element) => {
      const title = $(element).find('h2').text()
      const href = $(element).find('h2').find('a').attr('href')
      if (!(title.includes('Vídeo, '))) {
        content.push({
          title,
          href,
          source: `BBC Brasil`
        })
      }
    })
  } catch (error) {
    console.error(error)
  }
  return content
}