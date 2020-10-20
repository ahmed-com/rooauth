'use strict';

const { generateKeyPair } = require('crypto');
const jwt = require('jsonwebtoken');
const { SodiumPlus , CryptographyKey } = require('sodium-plus');
const fs = require('fs');
const path = require('path');
const { promisify  } = require('util');

let sodium;
let mySecret;

(async function initializeSecret(){
  if (!sodium) sodium = await SodiumPlus.auto();

  const secretPath = path.join(__dirname,'/../config/secret');
  mySecret = await sodium.crypto_secretbox_keygen();
  fs.writeFile(secretPath,mySecret.getBuffer(),()=>{});
})();

function testWithJWT(publicKey,privateKey){

  const payload = { };

  payload.field01 = "Data 01";
  payload.field02 = "Data 02";
  payload.field03 = "Data 03";

  console.log("Payload: " + JSON.stringify(payload));
  console.log(" ");

  const iss = "rooAuth";
  const sub = "ahmed0grwan@gmail.com";
  const aud = "http://gradebookapp.com";
  const exp = "24h";

  const signOptions = {
      issuer : iss,
      subject: sub,
      audience: aud,
      expiresIn: exp,
      algorithm: "RS256"
  };

  console.log(`Options: ${JSON.stringify(signOptions)}`);

  const token = jwt.sign(payload, privateKey, signOptions);

  console.log(`Token: ${token}`);

  const verifyOptions = {
      issuer : iss,
      subject: sub,
      audience: aud,
      maxAge: exp,
      algorithms: ["RS256"]
  };

  const verified = jwt.verify(token, publicKey, verifyOptions);
  console.log(`Verified: ${JSON.stringify(verified)}`);

  const decoded = jwt.decode(token, {complete: true});
  console.log(`Docoded Header: ${JSON.stringify( decoded.header)}`);
  console.log(`Docoded Payload: ${JSON.stringify(decoded.payload)}`);
}

async function generateTheKeys(){
    return new Promise((resolve,reject)=>{
      generateKeyPair('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
          }
        }, (error, publicKey, privateKey) => {
          if(error) {
            reject(error);
          }else{
            resolve({publicKey,privateKey})
          }
      });
    });
}

async function encryptText(text,secret){
    if (!sodium) sodium = await SodiumPlus.auto();
  
    let nonce = await sodium.randombytes_buf(24);
    let encrypted = await sodium.crypto_secretbox(text, nonce, secret);
    return Buffer.concat([nonce, encrypted]).toString('hex');
}

async function decryptCipher(ciphertext,secret){
    if (!sodium) sodium = await SodiumPlus.auto();

    const decoded = Buffer.from(ciphertext, 'hex');
    const nonce = decoded.slice(0, 24);
    const cipher = decoded.slice(24);
    return sodium.crypto_secretbox_open(cipher, nonce, secret);
}

async function getMySecret(){
  if(!mySecret){
    const secretPath = path.join(__dirname,'/../config/secret');
    const mySecretBuffer = await promisify(fs.readFile)(secretPath);
    const mySecret = new CryptographyKey(mySecretBuffer);
    return mySecret;
  }
  return mySecret;
}

async function initializeTenent(userId,options){
  // this function is only intended to illustrate my logic

  const secret = await getMySecret();
  const {publicKey , privateKey} = await generateTheKeys(); 
  const encryptedPrivateKey = await encryptText(privateKey,secret);
  
  const recordProperties = {
    MFA : options.MFA,
    schema : options.schema,
    whiteListIps : options.whiteListIps,
    ipRateLimit : options.ipRateLimit,
    maxSession : options.maxSession,
    privateKey : encryptedPrivateKey,
    publicKey
  }

  const tenent = await createTenent(recordProperties);

  const tablesProperties = {
    MFA : options.MFA,
    storePhoto : options.storePhoto,
    storeLogins : options.storeLogins,
    tenentId : tenent.id
  }

  await createTables(tablesProperties);

  async function createTenent(recordProperties){
    // store data in database and return tenent obj
  }
  
  async function createTables(tablesProperties){
  
    if(tablesProperties.MFA !== null && tablesProperties.storePhoto === false){
      await createSubjectsTable(tablesProperties.tenentId);
    }else if(tablesProperties.MFA !== null && tablesProperties.storePhoto === true){
      await createSubjectsTableWithPhoto(tablesProperties.tenentId);
    }else{
      await createSubjectsTableWithPhotoAndMFA(tablesProperties.tenentId);
    }
  
    await createSessionsTable(tablesProperties.tenentId);
  
    if(tablesProperties.storeLogins){
      await createLoginsTable(tablesProperties.tenentId);
    }
  
    return;
  }
  
  async function createSubjectsTableWithPhoto(tenentId){
    // create the table in database
  }
  
  async function createSubjectsTable(tenentId){
    // create the table in database
  }
  
  async function createSubjectsTableWithPhotoAndMFA(tenentId){
    // create the table in database
  }
  
  async function createSessionsTable(tenentId){
    // create the table in database
  }
  
  async function createLoginsTable(tenentId){
    // create the table in database
  }  

  return tenent;
}