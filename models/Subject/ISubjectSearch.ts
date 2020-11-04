export default interface ISubjectSearch<Subject>{
    byId : (id:number) => Promise<Subject>,
    byAccount : (account:string) => Promise<Subject>,

    createdAfterDate?: (date:Date) => Promise<Subject[]>,
    createdBeforeDate?: (date:Date) => Promise<Subject[]>
}