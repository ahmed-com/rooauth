export default interface ISubjectGet{
    account: () => Promise<string>,
    passwordHash: () => Promise<string>,
    oldPasswordHash: () => Promise<string | null>,
    passwordChangedAt: () => Promise<string | null>,
    enableMfa: () => Promise<boolean>,
    accountVerified: () => Promise<boolean>,

    createdAt?: () => Promise<string>,
    updatedAt?: () => Promise<string | null>,
    data?: () => Promise<string | null>
}