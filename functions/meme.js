const fs = require('fs')
const path = require('path')

exports.handler = async (event, context) => {
  const diretorioImagens = 'public/images'
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 500,
      headers,
      body: 'ERROR: Não pode realizar ação'
    }
  } else try {
    // lê o diretório de imagens
    const imagens = fs.readdirSync(diretorioImagens)
    
    // filtra arquivos de imagem e empurra pra dentro da array
    const imagensFiltradas = imagens.filter((imagem) => {
      const extensao = path.extname(imagem).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(extensao)
    })

    const randIndex = Math.floor(Math.random() * imagensFiltradas.length)

    // le o arquivo da imagem aleatória
    const randMeme = fs.readFileSync(path.join(diretorioImagens, imagensFiltradas[randIndex]))

    const headers = {
      'Content-Type': 'image/jpeg', // Defina o tipo de conteúdo da imagem
    }

    // retorna um meme aleatorio como corpo da resposta
    return {
      statusCode: 200,
      headers,
      body: randMeme.toString('base64'), // Converte os bytes em base64
      isBase64Encoded: true, 
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao obter a imagem aleatória' }),
    }
  }
}
