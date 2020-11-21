import IQuery from '../../IQuery';

type DeletionMethod = (queryData:any)=>IQuery;

export default interface SubjectDeletionCollection{
    all : DeletionMethod,
    byId: DeletionMethod,
    byAccount:DeletionMethod,

    // the decorator fields
    createdAfterDate?: DeletionMethod,
    createdBeforeDate?: DeletionMethod
}