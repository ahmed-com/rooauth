export default interface ISubjectInput{
    account:string,
    passwordHash:string,
    enableMfa?:boolean,
    accountVerified?:boolean,
    oldPasswordHash?:string | null,
    passwordChangedAt?:Date | null,

    createdAt?:Date,
    data?:string | null,
    updatedAt?:Date | null
}