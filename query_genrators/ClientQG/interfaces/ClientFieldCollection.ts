import Field from '../../Field';

export default interface IClientFieldCollection{
    clientId : Field,
    clientSecretHash: Field,
    details : Field,
    tenentId : Field
}