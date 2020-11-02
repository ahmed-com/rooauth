import Field from "../../Field";

export default interface LoginFieldCollection{
    subjectId : Field,
    jti : Field,
    passwordLogin: Field,
    clientId : Field,
    ip:Field,

    // the decorator Fields
    deviceInfo?: Field,
    loggedAt?:Field
}