require('dotenv').config()
const cheerio = require('cheerio');

const headers = {
  'Cache-Control': 'public, s-maxage=3600',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*'
}
exports.handler = async (event, context) => {
  const globo_Headlines = await getGloboHeadline()
  const uolMaisLidas = await getUOLMaisLidas()

  const headlines = [
    ...globo_Headlines,
    ...uolMaisLidas
  ]


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

async function getGloboHeadline() {
  const res = await fetch('https://globo.com')
  const html = await res.text()
  const $ = cheerio.load(html)
  const topGloboCom = $('.topglobocom__ranking__content-item')
  let headlines = []

  topGloboCom.each((index, element) => {
    const title = $(element).text()
    const href = $(element).find('.post__link').attr('href')
    headlines.push({ title, href, source: 'Globo.com' })
  })
  return headlines
}

async function getUOLMaisLidas() {
  const res = await fetch('https://www.uol.com.br')
  const html = await res.text()
  const $ = cheerio.load(html)
  const mais_lidas_uol = $('.mostRead__item')
  let maislidas = []

  mais_lidas_uol.each((index, element) => {
    const rawTitle = $(element).find('h3').text()
    const title = rawTitle.trim()
    // console.log('ISSO É UM TITULO', title);
    const href = $(element).find('a').attr('href')
    maislidas.push({
      title,
      href,
      source: 'UOL'
    })
  })
  return maislidas
}

