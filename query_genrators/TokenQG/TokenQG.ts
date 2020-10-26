import FieldCollection from '../FieldCollection';
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString} from '../utils';

export default class TokenQG{

    public fields:FieldCollection;
    public readableFields:FieldCollection;
    public writableFields:FieldCollection;

    constructor(
        private tenentId:number
    ){
        this.fields = {
            jti : {
                name : 'jti',
                definetion : 'INTEGER UNSIGNED NOT NULL UNIQUE auto_increment',
                insertionValue : 'DEFAULT',
                updateValue : ':jti'
            },

            sub : {
                name : 'sub',
                definetion : 'sub INTEGER UNSIGNED NOT NULL',
                insertionValue : ':sub',
                updateValue : ':sub'
            },

            exp : {
                name : 'exp',
                definetion : 'exp DATETIME NOT NULL',
                insertionValue : ':exp',
                updateValue : ':exp'
            }
        }

        this.readableFields = {
            ...this.fields
        };

        this .writableFields = {
            ...this.fields
        }
    }

    public get id():number{
        return this.tenentId;
    }

    public createTable(engine:StorageEngine):string{
        const fieldsString:string = defienetionString(this.fields);

        return `CREATE TABLE IF NOT EXISTS tno${this.tenentId}tokens (
            ${fieldsString}
            PRIMARY KEY (jti),
            FOREIGN KEY (sub) REFERENCES tno${this.tenentId}subjects(id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${engine};`;
    }

    public insertToken():string{
        return insertString (this.fields,`tno${this.tenentId}tokens`)
    }

    /**
     * @summary
     * {jti:number}
     */
    public selectTokenById():string{
        return `SELECT * FROM tno${this.tenentId}tokens WHERE jti=:jti LIMIT 1;`;
    }

    /**
     * @summary
     * {date:date , limit?:number , offset?:number}
     */
    public selectTokensExpiredBeforeDate(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return `SELECT * FROM tno${this.tenentId}tokens WHERE exp < :date` + pagination;
    }

    /**
     * @summary
     * {sub:number , limit?:number , offset?:number}
     */
    public selectTokensBySubject(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return `SELECT * FROM tno${this.tenentId}tokens WHERE sub = :sub` + pagination;
    }
}