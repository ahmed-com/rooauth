import Field from "../../query_genrators/Field";

export default interface ITenentUpdateFieldObj{
    subjectSchema?:Field,
    mfaEnableDefault?:Field,
    mfaMethod?:Field,
    privateKeyCipher?:Field,
    publicKey?:Field,
    allowIpWhiteListing?:Field,
    maxSession?:Field,
    ipRateLimit?:Field
}