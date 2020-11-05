export default interface ClientDBRow{
    clientId?:number,
    clientSecretHash?:string,
    details?:string | null,
    tenentId:number
}