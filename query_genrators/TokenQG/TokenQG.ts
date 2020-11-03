import TokenFieldCollection from './interfaces/TokenFieldCollection';
import TokenSelectionCollection from "./interfaces/TokenSelectionCollection";
import TokenDeletionCollection from './interfaces/TokenDeletionCollection';
import TokenUpdateCollection from './interfaces/TokenUpdateCollection';
import Field from "../Field";
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString, constructSelect} from '../utils';
import constructDelete from '../utils/constructDelete';
import IQuery from '../IQuery';

export default class TokenQG{

    public fields:TokenFieldCollection;
    public readableFields:TokenFieldCollection;
    public writableFields:{verified?:Field};

    public select:TokenSelectionCollection;
    public delete:TokenDeletionCollection;
    public update:TokenUpdateCollection;

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

        this.writableFields = {}

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

        this.update = {}

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
        const allFields:Field[] = Object.values(this.fields);
        const fieldsString:string = defienetionString(allFields);
        const queryStr:string = `CREATE TABLE IF NOT EXISTS tno${this.tenentId}tokens (
            ${fieldsString}
            PRIMARY KEY (jti),
            FOREIGN KEY (sub) REFERENCES tno${this.tenentId}subjects(id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${engine};`;

        return {queryStr , queryData : {}};
    }

    public insertToken(queryData:object):IQuery{
        const allFields:Field[] = Object.values(this.fields);
        const queryStr:string = insertString (allFields,`tno${this.tenentId}tokens`);

        return {queryStr , queryData };
    }
}