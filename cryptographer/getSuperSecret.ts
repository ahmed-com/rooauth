import path from 'path';
import fs from 'fs';
import {promisify} from 'util';

const { CryptographyKey } = require('sodium-plus');

export default async function getMySuperSecret(){

    const superSecretPath = path.join(__dirname,'/../config/superSecret');
    const mySecretBuffer = await promisify(fs.readFile)(superSecretPath);
    const mySuperSecret = new CryptographyKey(mySecretBuffer);
    return mySuperSecret;
    
  }