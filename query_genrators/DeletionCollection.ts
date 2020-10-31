import IQuery from './IQuery';

type DeletionCollection = (data?:any)=>IQuery;

export default interface selectionCollection{
    [field:string] : DeletionCollection
}