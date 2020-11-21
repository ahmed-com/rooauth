import Field from '../../Field';
import IQuery from '../../IQuery';

type SelectionMethod = (queryData:any,...fields:Field[])=>IQuery;

export default interface LoginSelectionCollection{
    all : SelectionMethod,
    bySubjectId: SelectionMethod,
    byIp : SelectionMethod,
    byJti : SelectionMethod,
    byClientId:SelectionMethod,

    // the decorator fields
    afterDate?:SelectionMethod,
    beforeDate?:SelectionMethod
}