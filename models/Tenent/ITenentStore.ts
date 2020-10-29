export default interface ITenentStore{
    storeForSubject:{
        createdAt:boolean,
        updatedAt:boolean,
        data:boolean
    },
    storeForLogins: {
        deviceInfo : boolean,
        loggedAt : boolean
    } | false,
    storeForTokens : {
        verified : boolean
    }
}