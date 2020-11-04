import Field from '../../Field';
import IQuery from '../../IQuery';

type UpdateMethod = (queryData:any,...fields:Field[])=>IQuery;

export default interface TenentUpdateCollection{
    all:UpdateMethod,
    byTenentId:UpdateMethod
}