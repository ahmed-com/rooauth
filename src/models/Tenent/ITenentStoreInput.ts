export default interface ITenentStoreInput{
    storeForSubject:{
        createdAt:boolean | null,
        updatedAt:boolean | null,
        data:boolean
    },
    storeForLogins: {
        deviceInfo : boolean | null,
        loggedAt : boolean | null
    } | false | null,
    storeForTokens : {
        verified : boolean | null
    }
}