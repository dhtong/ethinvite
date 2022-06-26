import { Web3Storage } from 'web3.storage';
import { getFilesFromPath } from 'web3.storage';
import { fileSync } from 'tmp';
import { writeFileSync } from 'fs';

// TODO test this
const storageAPIToken = process.env.WEB3_STORAGE_TOKEN;

async function upload(encryptedCalFilePath, encryptedAESKey) {
  const aesFilePath = createTmpAESFileFor(encryptedAESKey);
  return await uploadEncrypted('README.md', aesFilePath);
}

function createTmpAESFileFor(encryptedKey) {
  const tmpobj = fileSync();
  writeFileSync(tmpobj.name, encryptedKey);
  return tmpobj.name;
}

// filePath: tmp file path to encrypted ics file
async function uploadEncrypted(encryptedCalFilePath, encryptedAESKeyFilePath) {
  console.log(process.env.WEB3_STORAGE_TOKEN)

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

const _upload = upload;
export { _upload as upload };
