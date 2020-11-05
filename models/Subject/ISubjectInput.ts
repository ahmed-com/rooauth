export default interface ISubjectInput{
    account:string,
    passwordHash:string,
    enableMfa?:boolean,
    accountVerified?:boolean,
    oldPasswordHash?:string | null,
    passwordChangedAt?:string | null,

    createdAt?:string,
    data?:string | null,
    updatedAt?:string | null
}