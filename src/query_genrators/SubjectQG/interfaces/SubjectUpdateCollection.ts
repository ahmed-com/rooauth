import Field from '../../Field';
import IQuery from '../../IQuery';

type UpdateMethod = (queryData:any,...fields:Field[])=>IQuery;

export default interface SubjectUpdateCollection{
    all : UpdateMethod,
    byId : UpdateMethod,
    byAccount : UpdateMethod,

    // the decorator fields
    createdAfterDate?:UpdateMethod,
    createdBeforeDate?:UpdateMethod
}