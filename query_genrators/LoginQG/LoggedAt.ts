import Field from '../Field';
import LoginQG from './LoginQG';
import { constructSelect } from '../utils';

export default class LoggedAt extends LoginQG{

    constructor(lQG:LoginQG){
        super(lQG.id);

        const decoratorDefault:string = 'NOW()';
        const decoratorField:Field = {
            default : decoratorDefault,
            definetion : `logged_at DATETIME NOT NULL DEFAULT ${decoratorDefault}`,
            name : "logged_at",
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

    private selectLoginsAfterDate(ignorePagination?:boolean,...fields:Field[]):string{
        const pagination:boolean = ignorePagination === undefined ? false : ignorePagination;
        const condition:string = 'logged_at > :date';
        const tableName:string = `tno${this.id}logins`;
        return constructSelect(fields,tableName,condition,pagination);
    }

    private selectLoginsBeforeDate(ignorePagination?:boolean,...fields:Field[]):string{
        const pagination:boolean = ignorePagination === undefined ? false : ignorePagination;
        const condition:string = 'logged_at < :date';
        const tableName:string = `tno${this.id}logins`;
        return constructSelect(fields,tableName,condition,pagination);
    }
}