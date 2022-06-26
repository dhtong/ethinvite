import express from 'express'
import { isRegistered, register } from './db.js'

const app = express()
const port = process.env.PORT
const ipfsUpload = require('./upload-files')

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/isRegistered/:walletAddress', (req, res) => {
  res.json(false);
  // res.json(isRegistered(req.params.walletAddress));
});

app.post('/register', (req, res) => {
  console.log("isRegistered", req.body);
  res.send(req.body);
  // const { walletAddress, publicKey } = req.body;
  // register(walletAddress, publicKey);
  // res.send("OK")
});

app.post('/ingestion', async (req, res) => {
  console.log(req.params)
  if(req.params['attachment-1']['type'] == 'text/calendar') {
    filePath = req.params['attachment-1']['tempfile']
    await ipfsUpload.upload(filePath, "something")
  }
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})