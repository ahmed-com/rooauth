import IQuery from '../../IQuery';

type DeletionMethod = (queryData:any)=>IQuery;

export default interface TenentDeletionCollection{
    all : DeletionMethod,
    byTenentId : DeletionMethod
}