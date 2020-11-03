import Field from '../../Field';
import IQuery from '../../IQuery';

type UpdateMethod = (queryData:any,...fields:Field[])=>IQuery;

export default interface TokenUpdateCollection{
    
    // decorator fields
    byVerified?:UpdateMethod
}