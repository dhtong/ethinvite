const express = require('express') // server
const axios = require("axios") // http requests
const EthUtil = require('ethereumjs-util')
const EthTx = require('ethereumjs-tx')


const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
  getPublicKey('0x09a330734FBC217B87e35345c0754d3f8753CEb9')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function encrypt(data, address) {
    // generate encryption key
    // encrypt data with encryption key
    // encrypt encryption key with address using metamask
}

function getPublicKey(address) {
    axios
        .get('https://api.covalenthq.com/v1/1/address/' + address + '/transactions_v2/?&key=ckey_e85286384af446be81dcae8e407',
        {
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            console.log(`statusCode: ${res.status}`);

            const signedTx = res.data.data.items[0].tx_hash;
            console.log(signedTx);

            const tx = new EthTx.Transaction({data: signedTx})
            console.log(`public key: ${EthUtil.bufferToHex(tx.getSenderPublicKey())}`)
            console.log(`address: ${EthUtil.bufferToHex(tx.getSenderAddress())}`)
        })
        .catch(error => {
            console.error(error)
        })
}

