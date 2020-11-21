import IQuery from '../../IQuery';

type DeletionMethod = (queryData:any)=>IQuery;

export default interface TokenDeletionCollection{
    all : DeletionMethod,
    byJti : DeletionMethod,
    tokensExpiredBeforeDate : DeletionMethod,
    bySub : DeletionMethod
}