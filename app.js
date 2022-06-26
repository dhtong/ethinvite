import express from 'express'
import bodyparser from 'body-parser'
import { publicKeyForWallet, register, cidsForWallet, recordCID } from './db.js'
// import { upload } from './upload-files.js'
import { upload } from './upload-files.js'
import cors from 'cors';
import multer from 'multer'
import emailaddr from 'email-addresses'
import { aesEncrypt, aesKeyForWallet, ethEncrypt } from './encrypt.js';
import { Readable } from  'stream';


const app = express()
const port = process.env.PORT
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.ics')
  }
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

app.get('/ipfsCids/:walletAddress', async (req, res) => {
  res.json(await cidsForWallet(req.params.walletAddress));
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
  console.log(`Recipient address: ${req.body['recipient']}`)
  const eAddr = emailaddr.parseOneAddress(req.body['recipient'])
  const walletAddr = eAddr.local
  console.log(walletAddr)

  const aesKey = await aesKeyForWallet(walletAddr);
  const publicKey = await publicKeyForWallet(walletAddr);
  console.log('wallet:', walletAddr, ' aesKey: ', aesKey, ' publicKey:', publicKey);
  const encryptedAESKey = ethEncrypt(aesKey, await publicKeyForWallet(walletAddr));

  console.log(Object.keys(req.body))
  const f = req.files['attachment-1'][0]
  if(f.originalname.endsWith('.ics')) {
    const jsonBlob = aesEncrypt(req.files['attachment-1'][0].buffer, aesKey)
    // const stream = new Readable();
    // stream.push(JSON.stringify(jsonBlob));
    // stream.push(null);
    // stream.name = req.files['attachment-1'][0].path;
    const cid = await upload(JSON.stringify(jsonBlob), encryptedAESKey)
    recordCID(walletAddr, cid);
  }
  res.send()
  // 
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})