import path from 'path';
import fs from 'fs';
import {promisify} from 'util';

const { CryptographyKey } = require('sodium-plus');

export default async function getMySecret(){

    const secretPath = path.join(__dirname,'/../config/secret');
    const mySecretBuffer = await promisify(fs.readFile)(secretPath);
    const mySecret = new CryptographyKey(mySecretBuffer);
    return mySecret;
    
  }