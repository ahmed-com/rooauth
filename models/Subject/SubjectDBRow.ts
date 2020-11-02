export default interface SubjectDBRow{
    id:number,
    
    account?:string,
    passwordHash?:string,
    oldPasswordHash?:string | null,
    passwordChangedAt?:Date | null,
    enableMfa?:boolean,
    accountVerified?:boolean,

    createdAt?:Date,
    data?:string | null,
    updatedAt?:Date | null
}