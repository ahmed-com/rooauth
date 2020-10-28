import FieldCollection from '../FieldCollection';
import SelectionCollection from "../SelectionCollection";
import UpdateCollection from '../UpdateCollection';
import DeleteCollection from '../DeletionCollection';
import Field from "../Field";
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString, constructSelect, constructUpdate} from '../utils';
import constructDelete from '../utils/constructDelete';

export default class TokenQG{

    public fields:FieldCollection;
    public readableFields:FieldCollection;
    public writableFields:FieldCollection;

    public select:SelectionCollection;
    public update:UpdateCollection;
    public delete:DeleteCollection;

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
                const condition:string = 'exp < :exp';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructSelect(fields,tableName,condition,pagination(ignorePagination));
            },

            bySub : (ignorePagination:boolean,...fields:Field[]):string=>{
                const condition:string = 'sub = :sub';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructSelect(fields,tableName,condition,pagination(ignorePagination));
            }
        }

        this.update = {

            all : (...fields:Field[]):string=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructUpdate(fields,tableName,condition);
            },

            byJti : (...fields:Field[]):string=>{
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructUpdate(fields,tableName,condition);
            },

            tokensExpiredBeforeDate : (...fields:Field[]):string=>{
                const condition:string = 'exp < :exp';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructUpdate(fields,tableName,condition);
            },

            bySub : (...fields:Field[]):string=>{
                const condition:string = 'sub = :sub';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructUpdate(fields,tableName,condition);
            }

        }

        this.delete = {

            all : ():string => {
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructDelete(tableName,condition);
            },

            byJti : ():string => {
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructDelete(tableName,condition);
            },

            bySub : ():string => {
                const condition:string = 'sub = :sub';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructDelete(tableName,condition);
            },

            tokensExpiredBeforeDate : ():string => {
                const condition:string = 'exp < :exp';
                const tableName:string = `tno${this.tenentId}tokens`;
                return constructDelete(tableName,condition);
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