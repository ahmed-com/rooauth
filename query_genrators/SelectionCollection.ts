import Field from './Field';
import IQuery from './IQuery';

type SelectionMethod = (queryData:any,...fields:Field[])=>IQuery;

export default interface selectionCollection{
    [field:string] : SelectionMethod
}