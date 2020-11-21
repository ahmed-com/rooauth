import IQuery from '../../IQuery';

type DeletionMethod = (queryData:any)=>IQuery;

export default interface IClientDeletionCollection{
    all : DeletionMethod,
    byClientId : DeletionMethod,
    byTenentId : DeletionMethod
}