import IQuery from './IQuery';

type DeletionCollection = (queryData:any)=>IQuery;

export default interface selectionCollection{
    [field:string] : DeletionCollection
}