exports.handler = async (event, context) => {


  const script = `
    <script>
      setTimeout(() => {
        window.location.href = '/api/hello'
      }, 8000)
    </script>
  `

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: script,
  }
}
