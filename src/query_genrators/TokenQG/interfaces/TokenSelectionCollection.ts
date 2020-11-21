import Field from '../../Field';
import IQuery from '../../IQuery';

type SelectionMethod = (queryData:any,...fields:Field[])=>IQuery;

export default interface TokenSelectionCollection{
    all:SelectionMethod,
    byJti:SelectionMethod,
    tokensExpiredBeforeDate:SelectionMethod,
    bySub:SelectionMethod
}