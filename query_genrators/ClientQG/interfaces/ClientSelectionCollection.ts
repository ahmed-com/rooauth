import Field from '../../Field';
import IQuery from '../../IQuery';

type SelectionMethod = (queryData:any,...fields:Field[])=>IQuery;

export default interface IClientSelectionCollection{
    all :SelectionMethod,
    byClientId:SelectionMethod,
    byTenentId:SelectionMethod
}