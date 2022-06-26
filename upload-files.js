import { Web3Storage } from 'web3.storage';
import { getFilesFromPath } from 'web3.storage';
import { fileSync } from 'tmp';
import { writeFileSync } from 'fs';
import { File } from 'web3.storage'

// TODO test this
const storageAPIToken = process.env.WEB3_STORAGE_TOKEN;

// async function upload(encryptedCalFilePath, encryptedAESKey) {
//   const aesFilePath = createTmpAESFileFor(encryptedAESKey);
//   return await uploadEncrypted(encryptedCalFilePath, aesFilePath);
// }

async function upload(encryptedCalString, encryptedAESKey) {
  const aesFile = makeFileObjects(encryptedAESKey, 'aes');
  const icsFile = makeFileObjects(encryptedCalString, 'ics');
  return await uploadEncrypted(icsFile, aesFile);
}

function createTmpAESFileFor(encryptedKey) {
  const tmpobj = fileSync();
  writeFileSync(tmpobj.name, encryptedKey);
  return tmpobj.name;
}

function makeFileObjects (content, filename) {
  const buffer = Buffer.from(content)

  const files = [
    new File([buffer], filename)
  ]
  return files
}

// filePath: tmp file path to encrypted ics file
async function uploadEncrypted(encryptedCalFile, encryptedAESKeyFile) {
  const storage = new Web3Storage({ token: storageAPIToken });
  const files = [];
  // const iscFile = await getFilesFromPath(encryptedCalFile);
  files.push(...encryptedCalFile);
  // const aesFile = await getFilesFromPath(encryptedAESKeyFile);
  files.push(...encryptedAESKeyFile);

  console.log(`Uploading ${files.length} files`);
  const cid = await storage.put(files);
  return cid;
}

const _upload = upload;
export { _upload as upload };
