import { getMySecret, getSodium } from "./index";

export default async function decryptCipher(cipherText:string):Promise<string> {
    const sodium = getSodium();
    const secret = getMySecret();

    const decoded = Buffer.from(cipherText, 'hex');
    const nonce = decoded.slice(0, 24);
    const cipher = decoded.slice(24);
    return sodium.crypto_secretbox_open(cipher, nonce, secret);
}