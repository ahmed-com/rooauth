export default interface ISubjectUpdateDataObj{
    account?:string,
    passwordHash?:string,
    oldPasswordHash?:string | null,
    passwordChangedAt?:Date | null,
    enableMfa?:boolean,
    accountVerified?:boolean,

    data?:string | null,
    updatedAt?:Date | null
}