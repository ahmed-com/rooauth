import Field from './Field';

type SelectionMethod = (ignorePagination:boolean,...fields:Field[])=>string;

export default interface selectionCollection{
    [field:string] : SelectionMethod
}