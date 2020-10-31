import Field from '../Field';
import SubjectQG from './SubjectQG';
import { constructSelect, constructUpdate, pagination } from '../utils';
import constructDelete from '../utils/constructDelete';
import IQuery from '../IQuery';

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

        this.fields = {...sQG.fields , decoratorField};
        this.readableFields = {...sQG.readableFields , decoratorField};
        this.writableFields = {...sQG.writableFields , decoratorField};

        this.select = {
            subjectsCreatedAfterDate: this.selectSubjectCreatedAfterDate,
            subjectsCreatedBeforeDate: this.selectSubjectCreatedBeforeDate,
            ...sQG.select
        }

        this.update = {
            subjectsCreatedAfterDate: this.updateSubjectCreatedAfterDate,
            subjectsCreatedBeforeDate: this.updateSubjectCreatedBeforeDate,
            ...sQG.update
        }

        this.delete = {
            subjectsCreatedAfterDate: this.deleteSubjectCreatedAfterDate,
            subjectsCreatedBeforeDate: this.deleteSubjectCreatedBeforeDate,
            ...sQG.delete
        }

    }

    private selectSubjectCreatedAfterDate(queryData:{date:Date, limit?:number, offset?:number},...fields:Field[]):IQuery{
        const condition:string = 'createdAt > :date';
        const tableName:string = `tno${this.id}subject`;
        const paginationStr:string = pagination(queryData);
        const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
        return {queryStr , queryData }
    }

    private selectSubjectCreatedBeforeDate(queryData:{date:Date, limit?:number, offset?:number},...fields:Field[]):IQuery{
        const condition:string = 'createdAt < :date';
        const tableName:string = `tno${this.id}subject`;
        const paginationStr:string = pagination(queryData);
        const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
        return {queryStr , queryData }
    }

    private updateSubjectCreatedAfterDate(queryData:{date:Date},...fields:Field[]):IQuery{
        const condition:string = 'createdAt > :date';
        const tableName:string = `tno${this.id}subject`;
        const queryStr:string = constructUpdate(fields,tableName,condition);
        return {queryStr , queryData };
    }

    private updateSubjectCreatedBeforeDate(queryData:{date:Date},...fields:Field[]):IQuery{
        const condition:string = 'createdAt < :date';
        const tableName:string = `tno${this.id}subject`;
        const queryStr:string = constructUpdate(fields,tableName,condition);
        return {queryStr , queryData };
    }

    private deleteSubjectCreatedAfterDate(queryData:{date:Date, limit?:number, offset?:number}):IQuery{
        const condition:string = 'createdAt > :date';
        const tableName:string = `tno${this.id}subject`;
        const paginationStr:string = pagination(queryData);
        const queryStr:string = constructDelete(tableName,condition,paginationStr);
        return {queryStr , queryData };
    }

    private deleteSubjectCreatedBeforeDate(queryData:{date:Date, limit?:number, offset?:number}):IQuery{
        const condition:string = 'createdAt < :date';
        const tableName:string = `tno${this.id}subject`;
        const paginationStr:string = pagination(queryData);
        const queryStr:string = constructDelete(tableName,condition,paginationStr);
        return {queryStr , queryData };
    }
}