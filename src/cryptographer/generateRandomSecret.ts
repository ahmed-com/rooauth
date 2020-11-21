import {randomBytes} from 'crypto';

export default async function generateRandomSecret():Promise<string> {
    return new Promise((resolve,reject)=>{
        randomBytes(48,function callback(err:Error | null,buf:Buffer) {
            if(err){
                reject(err);
            }else{
                const secret:string = buf.toString('base64');
                resolve(secret);
            }
        })
    })
}