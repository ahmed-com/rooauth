export default interface SubjectDBRow{
    id:number,
    
    account?:string,
    passwordHash?:string,
    oldPasswordHash?:string | null,
    passwordChangedAt?:string | null,
    enableMfa?:boolean,
    accountVerified?:boolean,

    createdAt?:string,
    data?:string | null,
    updatedAt?:string | null
}