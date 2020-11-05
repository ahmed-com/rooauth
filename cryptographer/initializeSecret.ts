import { getSodium } from './index';
import path from 'path';
import fs from 'fs';

export default async function initializeMySecret(){
    const sodium = getSodium();
  
    const secretPath = path.join(__dirname,'/../config/secret');
    const superSecretPath = path.join(__dirname,'/../config/superSecret');

    const mySecret = await sodium.crypto_secretbox_keygen();
    const mySuperSecret = await sodium.crypto_secretbox_keygen();

    const storeSecret = new Promise((resolve,_)=>{
        fs.writeFile(secretPath,mySecret.getBuffer(),resolve);
    });
    
    const storeSuperSecret = new Promise((resolve,_)=>{
        fs.writeFile(superSecretPath,mySuperSecret.getBuffer(),resolve);
    });

    return Promise.all([storeSecret,storeSuperSecret]);
}