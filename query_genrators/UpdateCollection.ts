import Field from './Field';
import IQuery from './IQuery';

type UpdateMethod = (data?:any,...fields:Field[])=>IQuery;

export default interface selectionCollection{
    [field:string] : UpdateMethod
}