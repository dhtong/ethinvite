const express = require('express')
const app = express()
const port = process.env.PORT
const ipfsUpload = require('./upload-files')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/ingestion', async (req, res) => {
  if(req.params['attachment-1']['type'] == 'text/calendar') {
    filePath = req.params['attachment-1']['tempfile']
    await ipfsUpload.upload(filePath, "something")
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})