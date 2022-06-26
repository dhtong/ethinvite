import express from 'express'
import bodyparser from 'body-parser'
import { isRegistered, register } from './db.js'
import { upload } from './upload-files.js'
import cors from 'cors';
import multer from 'multer'

const app = express()
const port = process.env.PORT
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp')
  },
})

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

app.post('/ingestion', multer({ storage: storage }).fields([{ name: 'attachment-1', maxCount: 1 }]), async (req, res) => {
  // console.log(req.body)
  console.log(req.files['attachment-1'][0])
  // await upload(req.files['attachment-1'][0], "something")
  res.send()
  // 
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})