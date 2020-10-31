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

            all : (ignorePagination:boolean,...fields:Field[]):IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
                return {queryStr , queryData : {}};
            },

            byJti : (_:boolean,jti:number,...fields:Field[]):IQuery=>{
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructSelect(fields,tableName,condition," Limit 1 ");
                return {queryStr , queryData : {jti}};
            },

            tokensExpiredBeforeDate : (ignorePagination:boolean,date:Date,...fields:Field[]):IQuery=>{
                const condition:string = 'exp < :date';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
                return {queryStr , queryData : {date}};
            },

            bySub : (ignorePagination:boolean,sub:number,...fields:Field[]):IQuery=>{
                const condition:string = 'sub = :sub';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
                return {queryStr , queryData : {sub}};
            }
        }

        this.update = {

            all : (...fields:Field[]):IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData : {}};
            },

            byJti : (jti:number,...fields:Field[]):IQuery=>{
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData : {jti}};
            },

            tokensExpiredBeforeDate : (date:Date,...fields:Field[]):IQuery=>{
                const condition:string = 'exp < :date';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData : {date}};
            },

            bySub : (sub:number,...fields:Field[]):IQuery=>{
                const condition:string = 'sub = :sub';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData : {sub}};
            }

        }

        this.delete = {

            all : ():IQuery => {
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructDelete(tableName,condition);
                return {queryStr , queryData : {}};
            },

            byJti : (jti:number):IQuery => {
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructDelete(tableName,condition);
                return {queryStr , queryData : {jti}};
            },

            bySub : (sub:number):IQuery => {
                const condition:string = 'sub = :sub';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructDelete(tableName,condition);
                return {queryStr , queryData : {sub}};
            },

            tokensExpiredBeforeDate : (date:Date):IQuery => {
                const condition:string = 'exp < :date';
                const tableName:string = `tno${this.tenentId}tokens`;
                const queryStr:string = constructDelete(tableName,condition);
                return {queryStr , queryData : {date}};
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

    public insertToken(data:object):IQuery{
        const queryStr:string = insertString (this.fields,`tno${this.tenentId}tokens`);

        return {queryStr , queryData : data};
    }
}