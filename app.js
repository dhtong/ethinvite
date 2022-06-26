import express from 'express'
import bodyparser from 'body-parser'
import { publicKeyForWallet, register } from './db.js'
// import { upload } from './upload-files.js'
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

app.post('/ingestion', multer({ storage: storage }).fields([{ name: 'attachment-1', maxCount: 1 }]), async (req, res) => {
  // TODO add signature verification
  const f = req.files['attachment-1'][0]
  if(f.originalname.endsWith('.ics')) {
    await upload(req.files['attachment-1'][0].path, "AES KEY")
  }
  res.send()
  // 
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})