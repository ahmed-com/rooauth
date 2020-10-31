import FieldCollection from '../FieldCollection';
import SelectionCollection from "../SelectionCollection";
import UpdateCollection from '../UpdateCollection';
import DeleteCollection from '../DeletionCollection';
import Field from "../Field";
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString, constructSelect, constructUpdate} from '../utils';
import constructDelete from '../utils/constructDelete';
import IQuery from '../IQuery';

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

            all : (queryData:{limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}tokens`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData : {}};
            },

            byJti : (queryData:{jti:number, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}tokens`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            tokensExpiredBeforeDate : (queryData:{date:Date, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = 'exp < :date';
                const tableName:string = `tno${this.tenentId}tokens`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            bySub : (queryData:{sub:number, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = 'sub = :sub';
                const tableName:string = `tno${this.tenentId}tokens`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData };
            }
        }

        this.update = {

            all : (queryData:object,...fields:Field[]):IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData };
            },

            byJti : (queryData:{jti:number},...fields:Field[]):IQuery=>{
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData };
            },

            tokensExpiredBeforeDate : (queryData:{date:Date},...fields:Field[]):IQuery=>{
                const condition:string = 'exp < :date';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData };
            },

            bySub : (queryData:{sub:number},...fields:Field[]):IQuery=>{
                const condition:string = 'sub = :sub';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData };
            }

        }

        this.delete = {

            all : (queryData:{limit?:number, offset?:number}):IQuery => {
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}tokens`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructDelete(tableName,condition,paginationStr);
                return {queryStr , queryData : {}};
            },

            byJti : (queryData:{jti:number, limit?:number, offset?:number}):IQuery => {
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}tokens`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructDelete(tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            bySub : (queryData:{sub:number, limit?:number, offset?:number}):IQuery => {
                const condition:string = 'sub = :sub';
                const tableName:string = `tno${this.tenentId}tokens`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructDelete(tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            tokensExpiredBeforeDate : (queryData:{date:Date, limit?:number, offset?:number}):IQuery => {
                const condition:string = 'exp < :date';
                const tableName:string = `tno${this.tenentId}tokens`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructDelete(tableName,condition,paginationStr);
                return {queryStr , queryData };
            }

        }

    }

    public get id():number{
        return this.tenentId;
    }

    public createTable(engine:StorageEngine):IQuery{
        const fieldsString:string = defienetionString(this.fields);
        const queryStr:string = `CREATE TABLE IF NOT EXISTS tno${this.tenentId}tokens (
            ${fieldsString}
            PRIMARY KEY (jti),
            FOREIGN KEY (sub) REFERENCES tno${this.tenentId}subjects(id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${engine};`;

        return {queryStr , queryData : {}};
    }

    public insertToken(queryData:object):IQuery{
        const queryStr:string = insertString (this.fields,`tno${this.tenentId}tokens`);

        return {queryStr , queryData };
    }
}