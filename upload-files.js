var process = require('process').process;
var minimist = require('minimist').minimist;
var Web3Storage = require('web3.storage').Web3Storage;
var getFilesFromPath = require('web3.storage').getFilesFromPath;
var tmp = require('tmp');
var fs = require('fs');

// TODO test this
const storageAPIToken = process.env.WEB3_STORAGE_TOKEN;

async function upload(encryptedCalFilePath, encryptedAESKey) {
  const aesFilePath = createTmpAESFileFor(encryptedAESKey);
  return await uploadEncrypted('README.md', aesFilePath);
}

function createTmpAESFileFor(encryptedKey) {
  const tmpobj = tmp.fileSync();
  fs.writeFileSync(tmpobj.name, encryptedKey);
  return tmpobj.name;
}

// filePath: tmp file path to encrypted ics file
async function uploadEncrypted(encryptedCalFilePath, encryptedAESKeyFilePath) {
  const storage = new Web3Storage({ storageAPIToken });
  const files = [];
  const iscFile = await getFilesFromPath(encryptedCalFilePath);
  files.push(...iscFile);
  const aesFile = await getFilesFromPath(encryptedAESKeyFilePath);
  files.push(...aesFile);

  console.log(`Uploading ${files.length} files`);
  const cid = await storage.put(files);
  return cid;
}
