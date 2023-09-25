const sharp = require('sharp')

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Allow-Methods": "POST",
  "Content-Type": "application/json"
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido', message: 'Este endpoint só suporta solicitações POST.' }),
      ...headers
    }
  }
  try {
    //const webpImageHeader = JSON.parse(event.body).image.split(",")[0]
    const webpImageBase64 = JSON.parse(event.body).image.split(",")[1]
    const webpImageBuffer = Buffer.from(webpImageBase64, 'base64')

    const pngImageBuffer = await sharp(webpImageBuffer)
      .toFormat('png')
      .toBuffer()

    const pngImageBase64 = pngImageBuffer.toString('base64')
    const pngImageHeader = "data:image/png;base64,"
    const fullImageReturn = pngImageHeader + pngImageBase64

    return {
      statusCode: 200,
      body: JSON.stringify({ fullImageReturn }),
      headers: {
        ...headers
      }
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro na conversão da imagem' }),
    }
  }
}
