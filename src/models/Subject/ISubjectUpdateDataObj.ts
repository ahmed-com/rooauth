export default interface ISubjectUpdateDataObj{
    account?:string,
    passwordHash?:string,
    oldPasswordHash?:string | null,
    passwordChangedAt?:string | null,
    enableMfa?:boolean,
    accountVerified?:boolean,

    data?:string | null,
    updatedAt?:string | null
}