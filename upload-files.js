import { Web3Storage } from 'web3.storage';
import { getFilesFromPath } from 'web3.storage';
import { fileSync } from 'tmp';
import fs from 'fs';

// TODO test this
const storageAPIToken = process.env.WEB3_STORAGE_TOKEN;

// async function upload(encryptedCalFilePath, encryptedAESKey) {
//   const aesFilePath = createTmpAESFileFor(encryptedAESKey);
//   return await uploadEncrypted(encryptedCalFilePath, aesFilePath);
// }

async function upload(encryptedCalString, encryptedAESKey) {
  const aesFiles = makeFileObjects(encryptedAESKey, 'encrypted_aes_key');
  const icsFiles = makeFileObjects(encryptedCalString, 'invite');
  return await uploadEncrypted(icsFiles, aesFiles);
}

// function createTmpAESFileFor(encryptedKey) {
//   const tmpobj = fileSync();
//   writeFileSync(tmpobj.name, encryptedKey);
//   return tmpobj.name;
// }

function makeFileObjects (content, name) {
  const blob = Buffer.from(content, 'utf8');

  const files = [
    new File([blob], name)
  ]
  return files
}

// filePath: tmp file path to encrypted ics file
async function uploadEncrypted(encryptedCalFiles, encryptedAESKeyFiles) {
  const storage = new Web3Storage({ token: storageAPIToken });
  const files = [];
  files.push(...encryptedCalFiles);
  files.push(...encryptedAESKeyFiles);

  console.log(`Uploading ${files.length} files`);
  const cid = await storage.put(files);
  return cid;
}

const _upload = upload;
export { _upload as upload };
