import { getSodium , getMySecret } from "./index";

export default async function encryptText(text:string):Promise<string> {
    const sodium = getSodium();
    const secret = getMySecret();

    let nonce = await sodium.randombytes_buf(24);
    let encrypted = await sodium.crypto_secretbox(text, nonce, secret);
    const encryptedString:string = Buffer.concat([nonce, encrypted]).toString('hex');
    return Promise.resolve(encryptedString);
}