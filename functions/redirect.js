exports.handler = async (event, context) => {

  // Define o cabeçalho Location com a URL de redirecionamento
  const headers = {
    Location: '/api/hello',
  }

  const statusCode = 301
  return {
    statusCode,
    headers,
  };
};
