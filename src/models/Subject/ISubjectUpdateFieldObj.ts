import Field from "../../query_genrators/Field";

export default interface ISubjectUpdateFieldObj{
    account?:Field,
    passwordHash?:Field,
    oldPasswordHash?:Field,
    passwordChangedAt?:Field,
    enableMfa?:Field,
    accountVerified?:Field,

    data?:Field,
    updatedAt?:Field
}