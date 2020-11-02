export default interface ISubjectGet{
    account: () => Promise<string>,
    passwordHash: () => Promise<string>,
    oldPasswordHash: () => Promise<string | null>,
    passwordChangedAt: () => Promise<Date | null>,
    enableMfa: () => Promise<boolean>,
    accountVerified: () => Promise<boolean>,

    createdAt?: () => Promise<Date>,
    updatedAt?: () => Promise<Date | null>,
    date?: () => Promise<string>
}