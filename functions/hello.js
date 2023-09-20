// functions/hello.js
exports.handler = async (event, context) => {
  console.log(event.queryStringParameters)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Ola" }),
  };
};

