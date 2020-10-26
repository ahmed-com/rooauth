import FieldCollection from '../FieldCollection';
import SelectionCollection from "../SelectionCollection";
import Field from "../Field";
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString, constructSelect} from '../utils';

export default class TokenQG{

    public fields:FieldCollection;
    public readableFields:FieldCollection;
    public writableFields:FieldCollection;

    public select:SelectionCollection;

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

        this.writableFields = {
            ...this.fields
        }

        this.select = {

            all : (ignorePagination:boolean,...fields:Field[]):string=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructSelect(fields,tableName,condition,pagination(ignorePagination));
            },

            byJti : (_:boolean,...fields:Field[]):string=>{
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructSelect(fields,tableName,condition,"LIMIT 1");
            },

            tokensExpiredBeforeDate : (ignorePagination:boolean,...fields:Field[]):string=>{
                const condition:string = 'exp < :date';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructSelect(fields,tableName,condition,pagination(ignorePagination));
            },

            bySub : (ignorePagination:boolean,...fields:Field[]):string=>{
                const condition:string = 'sub = :sub';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructSelect(fields,tableName,condition,pagination(ignorePagination));
            }
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
}