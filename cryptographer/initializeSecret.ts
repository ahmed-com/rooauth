import { getSodium } from './index';
import path from 'path';
import fs from 'fs';

export default async function initializeMySecret(){
    const sodium = getSodium();
  
    const secretPath = path.join(__dirname,'/../config/secret');
    const mySecret = await sodium.crypto_secretbox_keygen();
    fs.writeFile(secretPath,mySecret.getBuffer(),()=>{});
}