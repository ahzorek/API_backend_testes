require('dotenv').config()

exports.handler = async (event, context) => {
  let statusCode = 200
  let res, jobID, status, timesRunning = 0
  const API_KEY = process.env.PRODIA_API
  const headers = {
  'Content-Type': 'application/json; charset=utf-8',   
  }

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-Prodia-Key': API_KEY
    },
    body: JSON.stringify({
      prompt: 'kitty cats in a fluffy cloud',
      negative_prompt: 'poorly drawn, ugly, deformed, bizarre'
    })
  }

  await fetch('https://api.prodia.com/v1/sd/generate', options)
    .then(job_information => job_information.json())
    .then(job_information => {
        jobID = job_information.job
        console.log(job_information)
    }).catch(err => console.error(err))
  
  await new Promise(resolve => setTimeout(resolve, 6000))

  while (status !== 'succeeded' || timesRunning < 50) {
    timesRunning++
    console.log('Running for the ' +  timesRunning + ':', status)
    await fetch(`https://api.prodia.com/v1/job/${jobID}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-Prodia-Key': API_KEY
      }
    }).then(response => response.json())
      .then(response => {
        status = response.status
        res = response
      })
    .catch(err => console.error(err))
    }
  
  return {
    statusCode,
    headers,
    body: JSON.stringify({ res })
  }
}
