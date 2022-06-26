import { Web3Storage } from 'web3.storage';
import { getFilesFromPath } from 'web3.storage';
import { fileSync } from 'tmp';
import { writeFileSync } from 'fs';

// TODO test this
const storageAPIToken = process.env.WEB3_STORAGE_TOKEN;

// async function upload(encryptedCalFilePath, encryptedAESKey) {
//   const aesFilePath = createTmpAESFileFor(encryptedAESKey);
//   return await uploadEncrypted(encryptedCalFilePath, aesFilePath);
// }

async function upload(encryptedCalString, encryptedAESKey) {
  const aesFilePath = createTmpAESFileFor(encryptedAESKey);
  const icsFilePath = createTmpAESFileFor(encryptedCalString);
  return await uploadEncrypted(icsFilePath, aesFilePath);
}

function createTmpAESFileFor(encryptedKey) {
  const tmpobj = fileSync();
  writeFileSync(tmpobj.name, encryptedKey);
  return tmpobj.name;
}

// filePath: tmp file path to encrypted ics file
async function uploadEncrypted(encryptedCalFilePath, encryptedAESKeyFilePath) {
  const storage = new Web3Storage({ token: storageAPIToken });
  const files = [];
  var iscFile = await getFilesFromPath(encryptedCalFilePath);
  iscFile.name = iscFile.name + "_ics"
  files.push(...iscFile);
  const aesFile = await getFilesFromPath(encryptedAESKeyFilePath);
  files.push(...aesFile);

  console.log(`Uploading ${files.length} files`);
  const cid = await storage.put(files);
  return cid;
}

const _upload = upload;
export { _upload as upload };
