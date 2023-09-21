exports.handler = async (event, context) => {
  const atrasoEmMilissegundos = 8000
  let sillyThing = []

  await new Promise(resolve => setTimeout(resolve, atrasoEmMilissegundos))
  
  // for (let i = 0; i < atrasoEmMilissegundos; i++){
  //   sillyThing.push(i)
  //   console.log(i)
  // }
  
  // Define o cabeçalho Location com a URL de redirecionamento
  const headers = {
    Location: '/api/hello',
    Cache: 'no-cache,  must-revalidate'
  }

  const statusCode = 301
  return {
    statusCode,
    headers,
  }
}
