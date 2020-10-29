import MfaMethod from "./MfaMethodEnum";
import SubjectSchema from "./Schema";

export default interface ITenentUpdateDataObj{
    subjectSchema?:SubjectSchema | null,
    mfaEnableDefault?:boolean,
    mfaMethod?:string,
    privateKeyCipher?:string,
    publicKey?:string,
    allowIpWhiteListing?:boolean,
    maxSession?:number,
    ipRateLimit?:number
}