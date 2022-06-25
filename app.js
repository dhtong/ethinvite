const express = require('express')
const { PGClient } = require('pg')

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/pub', (req, res) => {
    const client = new PGClient()
    await client.connect()
    
    const ethAddr = req.params.addr 
    const pubKey = req.params.public_key

    const queryText = 'INSERT INTO [TODO]'
    const res = await client.query()

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})