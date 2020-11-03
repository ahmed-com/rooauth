import Field from "../../query_genrators/Field";

export default interface ITenentUpdateFieldObj{
    subjectSchema?:Field,
    mfaDefault?:Field,
    mfaMethod?:Field,
    privateKeyCipher?:Field,
    publicKey?:Field,
    hasIpWhiteList?:Field,
    maxSession?:Field,
    ipRateLimit?:Field
}