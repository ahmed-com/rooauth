import Field from '../Field';

export default interface IClientFieldCollection{
    clientId : Field,
    clientSecret: Field,
    userId : Field,
    tenentId : Field
}