import SubjectSchema from './Schema';

export default interface TenentDBRow{
    tenentId?:number,
    subjectSchema?:SubjectSchema | null,
    mfaDefault?:boolean,
    mfaMethod?:string,
    privateKeyCipher?:string,
    publicKey?:string,
    hasIpWhiteList?:boolean,
    storeLogins?:boolean,
    storeLoginTime?:boolean,
    storeLoginDeviceInfo?:boolean,
    storeSubjectCreatedAt?:boolean,
    storeSubjectUpdatedAt?:boolean,
    maxSession?:number,
    ipRateLimit?:number
}