export default interface ITenentUpdateDataObj{
    subjectSchema?:string | null,
    mfaDefault?:boolean,
    mfaMethod?:string,
    privateKeyCipher?:string,
    publicKey?:string,
    hasIpWhiteList?:boolean,
    maxSession?:number,
    ipRateLimit?:number
}