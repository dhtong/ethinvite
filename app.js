import express from 'express'
import bodyparser from 'body-parser'
import { isRegistered, register } from './db.js'
// import { upload } from './upload-files.js'
import cors from 'cors';
import multer from 'multer'

const app = express()
const port = process.env.PORT
// var jsonParser = bodyparser.json()

// app.use(bodyparser.json({
//   type(req) {
//     return true;
//   }
// }));

app.use(cors({origin: '*'}));

// app.use(express.json());

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

app.post('/ingestion', multer().any(), (req, res) => {
  // console.log(req.body)
  console.log(Object.keys(req.body))
  console.log(req.body['attachment-count'])
  console.log(req.body['attachment-1'])
  res.send()
  // if(req.body['attachment-1']['type'] == 'text/calendar') {
  //   filePath = req.body['attachment-1']['tempfile']
  //   await upload(filePath, "something")
  // }
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})