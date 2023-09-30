require('dotenv').config()
const cheerio = require('cheerio');

const headers = {
  'Cache-Control': 'public, s-maxage=7200',
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
  } else {
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
      body: JSON.stringify({
        headlines,
        size: headlines.length
      })
    }
  }
}

async function getGloboComTopHeadlines() {
  const res = await fetch('https://globo.com')
  const html = await res.text()
  const $ = cheerio.load(html)
  const topGloboCom = $('.topglobocom__ranking__content-item')
  let content = []

  topGloboCom.each((index, element) => {
    const title = $(element).text()
    const href = $(element).find('.post__link').attr('href')
    content.push({ title, href, source: 'Globo.com' })
  })
  return content
}

async function getUOLMaisLidas() {
  const res = await fetch('https://www.uol.com.br')
  const html = await res.text()
  const $ = cheerio.load(html)
  const mais_lidas_uol = $('.mostRead__item')
  let content = []

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
  return content
}

async function getBrasil247() {
  const res = await fetch('https://www.brasil247.com/ultimas-noticias')
  const html = await res.text()
  const $ = cheerio.load(html)
  const target = $('.articleGrid__item')
  let content = []

  target.each((index, element) => {
    const title = $(element).find('h3').text()
    // console.log('ISSO DEVE SER UM TITULO', title);
    const href = $(element).find('h3').find('a').attr('href')
    // console.log('ISSO DEVE SER UM HREF', href);
    content.push({
      title,
      href,
      source: 'Brasil247'
    })
  })
  content = content.slice(1)
  return content
}

async function getCNNBrasil(section = 'tecnologia') {
  const res = await fetch(`https://www.cnnbrasil.com.br/${section}/`)
  const html = await res.text()
  const $ = cheerio.load(html)
  const target = $('.home__list__item')
  const h2title = $('.home__category').text()
  let content = []

  target.each((index, element) => {
    const title = $(element).find('a').find('h3').text()
    const href = $(element).find('a').attr('href')
    content.push({
      title,
      href,
      source: `CNN Brasil - ${h2title}`
    })
  })
  return content
}

async function getBBCBrasil() {
  const res = await fetch(`https://www.bbc.com/portuguese/topics/cz74k717pw5t`)
  const html = await res.text()
  const $ = cheerio.load(html)
  const target = $('[data-testid="topic-promos"]').find('li')
  let content = []

  target.each((index, element) => {
    const title = $(element).find('h2').text()
    const href = $(element).find('h2').find('a').attr('href')
    content.push({
      title,
      href,
      source: `BBC Brasil`
    })
  })
  return content
}