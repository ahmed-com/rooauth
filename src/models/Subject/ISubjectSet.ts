export default interface ISubjectSet{
    account: (account:string) => void,
    passwordHash: (passwordHash:string) => void,
    enableMfa: (enableMfa:boolean) => void,
    accountVerified: (accountVerified:boolean) => void,

    data?: (data:string | null) => void
}