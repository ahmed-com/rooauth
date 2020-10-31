import Field from '../Field';
import LoginQG from './LoginQG';
import { constructSelect, pagination } from '../utils';
import IQuery from '../IQuery';

export default class LoggedAt extends LoginQG{

    constructor(lQG:LoginQG){
        super(lQG.id);

        const decoratorDefault:string = 'NOW()';
        const decoratorField:Field = {
            default : decoratorDefault,
            definetion : `loggedAt DATETIME NOT NULL DEFAULT ${decoratorDefault}`,
            name : "loggedAt",
            insertionValue : `IFNULL(:loggedAt,${decoratorDefault})`,
            updateValue : ':loggedAt'
        };
        
        this.fields = {...lQG.fields , decoratorField};
        this.readableFields = {...lQG.readableFields , decoratorField};

        this.select = {
            loginsAfterDate: this.selectLoginsAfterDate,
            loginsBeforeDate: this.selectLoginsBeforeDate,
            ...lQG.select
        }
    }

    private selectLoginsAfterDate(queryData:{date:Date, limit?:number, offset?:number},...fields:Field[]):IQuery{
        const condition:string = 'loggedAt > :date';
        const tableName:string = `tno${this.id}logins`;
        const paginationStr:string = pagination(queryData);
        const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
        return {queryStr, queryData };
    }

    private selectLoginsBeforeDate(queryData:{date:Date, limit?:number, offset?:number},...fields:Field[]):IQuery{
        const condition:string = 'loggedAt < :date';
        const tableName:string = `tno${this.id}logins`;
        const paginationStr:string = pagination(queryData);
        const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
        return {queryStr , queryData };
    }
}