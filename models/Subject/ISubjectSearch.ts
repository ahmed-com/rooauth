export default interface ISubjectSearch<Subject>{
    byId : (id:number) => Promise<Subject>,
    byAccount : (account:string) => Promise<Subject>,

    createdAfterDate?: (date:string) => Promise<Subject[]>,
    createdBeforeDate?: (date:string) => Promise<Subject[]>
}