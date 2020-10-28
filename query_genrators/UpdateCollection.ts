import Field from './Field';

type UpdateMethod = (...fields:Field[])=>string;

export default interface selectionCollection{
    [field:string] : UpdateMethod
}