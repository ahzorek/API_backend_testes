// functions/hello.js
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
}

exports.handler = async (event, context) => {
  // console.log(event)
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido', message: 'Este endpoint só suporta solicitações GET.' }),
      headers
    };
  } else return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: "Olá!" })
  }
}