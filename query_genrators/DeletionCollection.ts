import Field from './Field';

type DeletionCollection = (...fields:Field[])=>string;

export default interface selectionCollection{
    [field:string] : DeletionCollection
}