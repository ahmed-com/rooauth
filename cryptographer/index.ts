import encryptText from "./encrypt";
import initializeMySecret from './initializeSecret';
import getMySecret from './getSecret';
import decryptCipher from './decrypt';

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
    decryptCipher
};

