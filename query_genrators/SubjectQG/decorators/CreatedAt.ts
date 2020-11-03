import Field from '../../Field';
import SubjectQG from '../SubjectQG';
import { constructSelect, constructUpdate, pagination } from '../../utils';
import constructDelete from '../../utils/constructDelete';
import IQuery from '../../IQuery';

export default class CreatedAt extends SubjectQG{

    constructor(sQG:SubjectQG){
        super(sQG.id);

        const decoratorDefault:string = 'NOW()';
        const decoratorField:Field = {
            default : decoratorDefault,
            name : 'createdAt',
            insertionValue : `IFNULL(:createdAt,${decoratorDefault})`,
            definetion : `createdAt DATETIME NOT NULL DEFAULT ${decoratorDefault}`,
            updateValue : ':createdAt'
        }

        this.fields = {...sQG.fields , createdAt:decoratorField};
        this.readableFields = {...sQG.readableFields , createdAt:decoratorField};
        // this.writableFields = {...sQG.writableFields , createdAt:decoratorField}; // this field is not writable

        this.select = {

            createdAfterDate: (queryData:{date:Date, limit?:number, offset?:number},...fields:Field[]):IQuery =>{
                const condition:string = 'createdAt > :date';
                const tableName:string = `tno${this.id}subject`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData }
            },

            createdBeforeDate: (queryData:{date:Date, limit?:number, offset?:number},...fields:Field[]):IQuery =>{
                const condition:string = 'createdAt < :date';
                const tableName:string = `tno${this.id}subject`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData }
            },

            ...sQG.select
        }

        this.update = {

            createdAfterDate: (queryData:{date:Date},...fields:Field[]):IQuery => {
                const condition:string = 'createdAt > :date';
                const tableName:string = `tno${this.id}subject`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData };
            },

            createdBeforeDate: (queryData:{date:Date},...fields:Field[]):IQuery => {
                const condition:string = 'createdAt < :date';
                const tableName:string = `tno${this.id}subject`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData };
            },

            ...sQG.update
        }

        this.delete = {
            
            createdAfterDate: (queryData:{date:Date, limit?:number, offset?:number}):IQuery => {
                const condition:string = 'createdAt > :date';
                const tableName:string = `tno${this.id}subject`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructDelete(tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            createdBeforeDate: (queryData:{date:Date, limit?:number, offset?:number}):IQuery => {
                const condition:string = 'createdAt < :date';
                const tableName:string = `tno${this.id}subject`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructDelete(tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            ...sQG.delete
        }

    }
}