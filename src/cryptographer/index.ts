import encryptText from "./encrypt";
import initializeMySecret from './initializeSecret';
import getMySecret from './getSecret';
import getMySuperSecret from './getSuperSecret';
import decryptCipher from './decrypt';
import generateKeys from './generateKeys'
import generateRandomSecret from "./generateRandomSecret";
import lessEncrypt from './lessEncrypt';
import lessDecrypt from './lessDecrypt';

const { SodiumPlus , CryptographyKey } = require('sodium-plus');

let sodium:any;

function setSodium(_sodium:any):void{
    sodium = _sodium;
}

function getSodium():any{
    return sodium;
}


export { 
    setSodium,
    getSodium,
    encryptText,
    initializeMySecret,
    getMySecret,
    getMySuperSecret,
    decryptCipher,
    generateKeys,
    generateRandomSecret,
    lessDecrypt,
    lessEncrypt
};

