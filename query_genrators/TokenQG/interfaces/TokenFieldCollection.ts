import Field from "../../Field";

export default interface TokenFieldCollection{
    jti:Field,
    exp:Field,
    sub:Field,

    // decorator Fields
    verified?:Field
}