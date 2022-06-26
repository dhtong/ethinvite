import pg from 'pg'

// const client = new pg.Client();
// await client.connect();
// await client.query(`
// CREATE TABLE IF NOT EXISTS public_keys (
//     wallet_address VARCHAR PRIMARY KEY,
//     public_key VARCHAR NOT NULL
// )`);

export const publicKeyForWallet = async (walletAddress) => {
    console.log("chelllooo?", walletAddress);
    const existing = await client.query(
        'SELECT wallet_address, public_key FROM public_keys WHERE wallet_address = $1::text',
        [walletAddress],
    );
    console.log("got form db:", existing);
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
    console.log('registered::: ', registered);
    if (registered != null) {
        console.warn(`${walletAddress} is already registered with a public key: ${registered}`);
        return null;
    }
    return await client.query(
        'INSERT INTO public_keys (wallet_address, public_key) VALUES ($1, $2)',
        [walletAddress, publicKey]
    );
}