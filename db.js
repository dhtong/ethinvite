import { Client } from 'pg'

const client = new Client();
await client.connect();

const publicKeyForWallet = (walletAddress) => {
    const existing = await client.query(
        'SELECT wallet_address, public_key FROM public_keys WHERE wallet_address = $1::text',
        [walletAddress],
    );
    if (existing.rows.length == 0) {
        return null;
    }
    return existing.rows[0].public_key;
}

export const isRegistered = (walletAddress) => publicKeyForWallet(walletAddress) != null;

export const register = (walletAddress, publicKey) => {
    if (isRegistered(walletAddress)) {
        throw Exception(`${walletAddress} is already registered with a public key`)
    }
    return await client.query(
        'INSERT INTO public_keys (wallet_address, public_key) VALUES ($1, $2)',
        [walletAddress, publicKey]
    );
}