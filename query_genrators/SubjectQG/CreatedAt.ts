import Field from '../Field';
import SubjectQG from './SubjectQG';
import { constructSelect, constructUpdate, pagination } from '../utils';
import constructDelete from '../utils/constructDelete';

export default class CreatedAt extends SubjectQG{

    constructor(sQG:SubjectQG){
        super(sQG.id);

        const decoratorDefault:string = 'NOW()';
        const decoratorField:Field = {
            default : decoratorDefault,
            name : 'created_at',
            insertionValue : `IFNULL(:createdAt,${decoratorDefault})`,
            definetion : `created_at DATETIME NOT NULL DEFAULT ${decoratorDefault}`,
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

    private selectSubjectCreatedAfterDate(ignorePagination:boolean,...fields:Field[]):string{
        const condition:string = 'created_at > :createdAt';
        const tableName:string = `tno${this.id}subject`;
        return constructSelect(fields,tableName,condition,pagination(ignorePagination));
    }

    private selectSubjectCreatedBeforeDate(ignorePagination:boolean,...fields:Field[]):string{
        const condition:string = 'created_at < :createdAt';
        const tableName:string = `tno${this.id}subject`;
        return constructSelect(fields,tableName,condition,pagination(ignorePagination));
    }

    private updateSubjectCreatedAfterDate(...fields:Field[]):string{
        const condition:string = 'created_at > :createdAt';
        const tableName:string = `tno${this.id}subject`;
        return constructUpdate(fields,tableName,condition);
    }

    private updateSubjectCreatedBeforeDate(...fields:Field[]):string{
        const condition:string = 'created_at < :createdAt';
        const tableName:string = `tno${this.id}subject`;
        return constructUpdate(fields,tableName,condition);
    }

    private deleteSubjectCreatedAfterDate():string{
        const condition:string = 'created_at > :createdAt';
        const tableName:string = `tno${this.id}subject`;
        return constructDelete(tableName,condition);
    }

    private deleteSubjectCreatedBeforeDate():string{
        const condition:string = 'created_at < :createdAt';
        const tableName:string = `tno${this.id}subject`;
        return constructDelete(tableName,condition);
    }
}