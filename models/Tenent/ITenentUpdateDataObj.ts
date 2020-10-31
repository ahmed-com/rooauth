export default interface ITenentUpdateDataObj{
    subjectSchema?:string | null,
    mfaEnableDefault?:boolean,
    mfaMethod?:string,
    privateKeyCipher?:string,
    publicKey?:string,
    allowIpWhiteListing?:boolean,
    maxSession?:number,
    ipRateLimit?:number
}