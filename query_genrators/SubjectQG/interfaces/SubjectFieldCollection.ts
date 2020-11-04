import Field from '../../Field';

export default interface SubjectFieldCollection{
    id: Field,
    account:Field,
    passwordHash:Field,
    oldPasswordHash:Field,
    passwordChangedAt:Field,
    enableMfa:Field,
    accountVerified:Field,

    // decorator fields
    createdAt?:Field,
    data?:Field,
    updatedAt?:Field
}
