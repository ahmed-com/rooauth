import Field from '../../Field';
import IQuery from '../../IQuery';

type SelectionMethod = (queryData:any,...fields:Field[])=>IQuery;

export default interface SubjectSelectionCollection{
    all : SelectionMethod,
    byId: SelectionMethod,
    byAccount:SelectionMethod,

    // the decorator fields
    createdAfterDate?: SelectionMethod,
    createdBeforeDate?: SelectionMethod
}