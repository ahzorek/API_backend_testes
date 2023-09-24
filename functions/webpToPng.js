const sharp = require('sharp');

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
    const webpImageBase64 = JSON.parse(event.body).image
    const webpImageBuffer = Buffer.from(webpImageBase64, 'base64')

    const pngImageBuffer = await sharp(webpImageBuffer)
      .toFormat('png')
      .toBuffer()

    const pngImageBase64 = pngImageBuffer.toString('base64')

    return {
      statusCode: 200,
      body: JSON.stringify({ pngImageBase64 }),
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
