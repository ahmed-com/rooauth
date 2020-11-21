import { getSodium , getMySuperSecret } from "./index";

export default async function encryptText(text:string):Promise<string> {
    const sodium = getSodium();
    const superSecret = getMySuperSecret();

    let nonce = await sodium.randombytes_buf(24);
    let encrypted = await sodium.crypto_secretbox(text, nonce, superSecret);
    const encryptedString:string = Buffer.concat([nonce, encrypted]).toString('hex');
    return Promise.resolve(encryptedString);
}