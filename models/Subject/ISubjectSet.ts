export default interface ISubjectSet{
    account: (account:string) => void,
    passwordHash: (passwordHash:string) => void,
    oldPasswordHash: (oldPasswordHash:string | null) => void,
    passwordChangedAt: (passwordChangedAt:Date | null) => void,
    enableMfa: (enableMfa:boolean) => void,
    accountVerified: (accountVerified:boolean) => void,

    updatedAt?: (updatedAt:Date | null) => void,
    date?: (date:string) => void
}