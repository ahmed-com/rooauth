import Field from './Field';
import IQuery from './IQuery';

type SelectionMethod = (ignorePagination:boolean,data?:any,...fields:Field[])=>IQuery;

export default interface selectionCollection{
    [field:string] : SelectionMethod
}