import Field from '../Field';
import SubjectQG from './SubjectQG';
import { constructSelect, pagination } from '../utils';

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

    }

    private selectSubjectCreatedAfterDate(ignorePagination:boolean,...fields:Field[]):string{
        const condition:string = 'created_at > :date';
        const tableName:string = `tno${this.id}subject`;
        return constructSelect(fields,tableName,condition,pagination(ignorePagination));
    }

    private selectSubjectCreatedBeforeDate(ignorePagination:boolean,...fields:Field[]):string{
        const condition:string = 'created_at < :date';
        const tableName:string = `tno${this.id}subject`;
        return constructSelect(fields,tableName,condition,pagination(ignorePagination));
    }
}