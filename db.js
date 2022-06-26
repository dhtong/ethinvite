import pg from 'pg'

const client = new pg.Client();
await client.connect();
await client.query(`
CREATE TABLE IF NOT EXISTS public_keys (
    wallet_address VARCHAR PRIMARY KEY,
    public_key VARCHAR NOT NULL
)`);
await client.query(`
CREATE TABLE IF NOT EXISTS aes_keys (
    wallet_address VARCHAR PRIMARY KEY,
    aes_key VARCHAR NOT NULL
)`);
await client.query(`
CREATE TABLE IF NOT EXISTS ipfs_cids (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR NOT NULL,
    ipfs_cid VARCHAR NOT NULL
)`);

export const publicKeyForWallet = async (walletAddress) => {
    const existing = await client.query(
        'SELECT wallet_address, public_key FROM public_keys WHERE wallet_address = $1::text',
        [walletAddress],
    );
    if (existing.rows.length == 0) {
        return null;
    }
    const row = existing.rows[0];
    return {
        walletAddress: row.wallet_address,
        publicKey: row.public_key,
    };
}

export const register = async (walletAddress, publicKey) => {
    const registered = await publicKeyForWallet(walletAddress);
    if (registered != null) {
        console.warn(`${walletAddress} is already registered with a public key: ${registered}`);
        return null;
    }
    return await client.query(
        'INSERT INTO public_keys (wallet_address, public_key) VALUES ($1, $2)',
        [walletAddress, publicKey]
    );
}

export const getAESKeyForWallet = async (walletAddress) => {
    const existing = await client.query(
        'SELECT wallet_address, aes_key FROM aes_keys WHERE wallet_address = $1::text',
        [walletAddress],
    );
    if (existing.rows.length > 0) {
        return existing.rows[0].aes_key;
    }
    return null;
}

export const setAESKeyForWallet = async (walletAddress, aesKey) => {
    await client.query(
        'INSERT INTO aes_keys (wallet_address, aes_key) VALUES ($1, $2)',
        [walletAddress, aesKey]
    );
    return aesKey;
};

export const cidsForWallet = async (walletAddress) => {
    const rows = await client.query(
        'SELECT ipfs_cid FROM ipfs_cids WHERE wallet_address = $1::text',
        [walletAddress],
    );
    return rows.map((row) => row.ipfs_cid);
};

export const recordCID = async (walletAddress, cid) => {
    return await client.query(
        'INSERT INTO ipfs_cids (wallet_address, ipfs_cid) VALUES ($1, $2)',
        [walletAddress, cid]
    );
};