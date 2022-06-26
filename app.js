import express from 'express'
import bodyparser from 'body-parser'
import { publicKeyForWallet, register } from './db.js'
// import { upload } from './upload-files.js'
import cors from 'cors';
import multer from 'multer'

const app = express()
const port = process.env.PORT

let jsonParser = bodyparser.json({
  type(req) {
    return true;
  }
});

app.use(cors({origin: '*'}));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/checkRegistered/:walletAddress', async (req, res) => {
  res.json(await publicKeyForWallet(req.params.walletAddress));
});

app.post('/register', jsonParser, async (req, res, next) => {
  try {
    const { walletAddress, publicKey } = req.body;
    const got = await register(walletAddress, publicKey);
    if (got == null) {
      res.send("ALREADY_REGISTERED")
    } else {
      res.send("OK")
    }
  } catch (err) {
    next(err);
  }
});

app.post('/ingestion', multer().fields([{ name: 'attachment-1', maxCount: 1 }]), (req, res) => {
  // console.log(req.body)
  console.log(req.files)
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