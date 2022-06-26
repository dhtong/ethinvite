import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { bufferToHex } from 'ethereumjs-util';
import { encrypt } from '@metamask/eth-sig-util';
import { setAESKeyForWallet, getAESKeyForWallet } from './db.js';

export const aesKeyForWallet = async (walletAddress) => {
    const existing = await getAESKeyForWallet(walletAddress);
    if (existing != null) {
        return Buffer.from(existing, 'hex');
    }
    const newKey = randomBytes(32).toString('hex');
    await setAESKeyForWallet(walletAddress, newKey);
    return newKey;
}

// const encrypt = (payload, aesKey) => {
//     const encryptedAESKey = ethEncrypt(aesKey.toString('hex'), publicKey);
//     return {
//         aesEncryptedPayload: aesEncrypt(payload, aesKey),
//         encryptedAESKey,
//     };
// }

// export const decrypt = async ({aesEncryptedPayload, encryptedAESKey}, privateKey) => {
//     // const aesKey = await decryptWithPrivateKey(privateKey, encryptedAESKey);
//     // console.log("fetched aesKey: ", aesKey);

//     // decrypt payload with AES
//     const iv = Buffer.from(aesEncryptedPayload.iv, 'hex');
//     const cipherText = Buffer.from(aesEncryptedPayload.cipherText, 'hex');
//     const decipher = createDecipheriv('aes-256-cbc', Buffer.from(aesKey, 'hex'), iv);
//     return Buffer.concat([decipher.update(Buffer.from(aesEncryptedPayload.cipherText, 'hex')), decipher.final()]).toString();
// };

export const ethEncrypt = (payload, publicKey) => {
    console.log('ethEncrypting: ', payload)
    return bufferToHex(
        Buffer.from(
            JSON.stringify(
            encrypt({
                publicKey: publicKey,
                data: payload,
                version: 'x25519-xsalsa20-poly1305',
            })
            ),
            'utf8'
        )
    );
};

export const aesEncrypt = (payload, aesKey) => {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(aesKey), iv);
    const encrypted = Buffer.concat([cipher.update(payload), cipher.final()]);
    return {iv: iv.toString('hex'), cipherText: encrypted.toString('hex')};
}

const aesDecrypt = ({iv, cipherText}, aesKey) => {
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(aesKey, 'hex'), Buffer.from(iv, 'hex'));
    return Buffer.concat([decipher.update(Buffer.from(cipherText, 'hex')), decipher.final()]).toString();
}

// const publicKey = '35cd7513daf84b12bd886b7ad6f5fca038eef7f824224ae1620f3dffb0b4ac0a87d12e495092ecb0f380c71960cc2db52c25602917d983b097d004b93a881fcb';
// const publicKey = 'Vd3uVIJd06MEGVv8IG5RFjaKWG3DiPtS5mwTDdEqenU=';
// const publicKey = 'a827372869ae5022588cadd57fceb55c556f05d1ae6072990880088330e5b02aec06f14f6db08205a84434728abc71700475d9ebb0b9ff66b3a465df1b083aca';

// const encrypted = enrcypt('boop', publicKey);
// console.log(encrypted);