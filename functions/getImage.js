//const axios = require('axios')

exports.handler = async (event, context) => {

  // try {
  //   // Recupere a URL completa da imagem aleatória
  //   const jobGenID = ``

  //   // Faça uma segunda chamada HTTP para recuperar a imagem aleatória
  //   const imagemResponse = await axios.get(jobGenID, { responseType: 'arraybuffer' })

  //   // Defina o tipo de conteúdo da resposta
  //   const headers = {
  //     'Content-Type': 'image/jpeg', // Defina o tipo de conteúdo da imagem (pode variar dependendo do formato)
  //   }

  //   // Retorna a imagem aleatória como parte do corpo da resposta
  //   return {
  //     statusCode: 200,
  //     headers,
  //     body: Buffer.from(imagemResponse.data, 'binary').toString('base64'), // Converte os bytes em base64
  //     isBase64Encoded: true, // Indica que o corpo está codificado em base64
  //   }
  // } catch (error) {
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({ error: 'Erro ao obter a imagem aleatória' }),
  //   }
  // }
  return {
    statusCode: 200,
    body:  JSON.stringify({ message: 'Ainda em desenvolvimento' })
  }
}