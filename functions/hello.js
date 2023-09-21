// functions/hello.js
const headers = {
  'Content-Type': 'application/json; charset=utf-8',   
}

exports.handler = async (event, context) => {
  console.log(event)
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 500,
      headers,
      body: 'ERROR: Não pode realizar ação'
    }
  } else return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: "Olá!" })
  }
}