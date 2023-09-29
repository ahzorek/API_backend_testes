const axios = require('axios')

exports.handler = async (event) => {
  //console.log('I NEED TO TAKE A LOOK AT THIS::::', event)

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: 'ERROR: Não pode realizar ação'
    }
  } else try {
    // lê o diretório de imagens
    const memeList = require('../public/images.json')
    const baseUrlPath = event.rawUrl.split("api/meme")[0]
    const memesLength = memeList.length

    function randIndex(arrSize) {
      return Math.floor(Math.random() * arrSize)
    }

    async function stringifyMyMemes(memeobject) {
      const imageUrl = baseUrlPath + memeobject.path.split("public")[1]
      const axiosRes = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const base64Image = Buffer.from(axiosRes.data, 'binary').toString('base64')
      return base64Image
    }

    const stringifyidMeme = await stringifyMyMemes(
      memeList[randIndex(memesLength)]
    )

    // retorna um meme aleatorio como corpo da resposta
    return {
      statusCode: 200,
      'Content-Type': 'image/jpeg',
      body: stringifyidMeme,
      isBase64Encoded: true,
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao processar' }),
    }
  }
}
