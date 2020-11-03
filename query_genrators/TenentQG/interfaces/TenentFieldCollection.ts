import Field from "../../Field";

export default interface TenentFieldCollection{
    tenentId:Field,
    subjectSchema:Field,
    mfaDefault:Field,
    mfaMethod:Field,
    privateKeyCipher:Field,
    publicKey:Field,
    hasIpWhiteList:Field,
    storeLogins:Field,
    storeLoginTime:Field,
    storeLoginDeviceInfo:Field,
    storeSubjectCreatedAt:Field,
    storeSubjectUpdatedAt:Field,
    maxSession:Field,
    ipRateLimit:Field
}