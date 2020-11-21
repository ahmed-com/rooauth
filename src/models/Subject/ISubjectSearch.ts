export default interface ISubjectSearch<Subject>{
    byId : (id:number) => Promise<Subject>,
    byAccount : (account:string) => Promise<Subject>,

    createdAfterDate?: (date:string,limit:number,offset:number) => Promise<Subject[]>,
    createdBeforeDate?: (date:string,limit:number,offset:number) => Promise<Subject[]>
}