import { generateKeyPair } from 'crypto';

export default async function generateTheKeys():Promise<{publicKey:string, privateKey:string}>{
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
        }, function handleKeys(error:Error | null, publicKey:string, privateKey:string):void{
          if(error) {
            reject(error);
          }else{
            resolve({publicKey,privateKey})
          }
      });
    });
}