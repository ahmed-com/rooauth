import SelectionCollection from '../SelectionCollection';
import UpdateCollection from '../UpdateCollection';
import DeletionCollection from '../DeletionCollection';
import FieldCollection from '../FieldCollection';
import StorageEngine from "../StorageEngineEnum";
import { pagination , defienetionString, insertString, constructSelect, constructUpdate } from "../utils";
import Field from '../Field';
import IQuery from '../IQuery';

export default class LoginQG{

    public fields:FieldCollection;
    public readableFields:FieldCollection;
    public writableFields:FieldCollection;

    public select:SelectionCollection;
    public update:UpdateCollection;
    public delete:DeletionCollection;

    constructor(
        private tenentId:number
    ){

        this.fields = {
            subjectId : {
                name : 'subjectId',
                definetion: 'subjectId INTEGER UNSIGNED NOT NULL',
                insertionValue: ':subjectId',
                updateValue: ':subjectId'
            },

            jti : {
                name : 'jti',
                definetion : 'jti INTEGER UNSIGNED NULL',
                insertionValue : ':jti',
                updateValue : ':jti'
            },

            passwordLogin : {
                name : 'passwordLogin',
                definetion : 'passwordLogin BOOLEAN NOT NULL',
                insertionValue : ':passwordLogin',
                updateValue : ':passwordLogin'
            },

            clientId : {
                name : 'clientId',
                definetion : 'clientId INTEGER UNSIGNED NOT NULL',
                insertionValue : ':clientId',
                updateValue : ':clientId'
            },
            
            ip : {
                name : 'ip',
                definetion : 'CHAR(39) NOT NULL',
                insertionValue : ':ip',
                updateValue : ':ip'
            }
        }

        this.readableFields = {
            ...this.fields
        }

        /**
         * there are no field that is writable in the log
         */
        this.writableFields = {}

        this.select = {

            all : (ignorePagination:boolean,...fields:Field[]):IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}logins`;
                const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
                return {queryStr , queryData : {}};
            },

            bySubject : (ignorePagination:boolean,subjectId:number,...fields:Field[]):IQuery=>{
                const condition:string = 'subjectId = :subjectId';
                const tableName:string = `tno${this.tenentId}logins`;
                const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
                return {queryStr , queryData : {subjectId}};
            },

            byIp : (ignorePagination:boolean,ip:string,...fields:Field[]):IQuery=>{
                const condition:string = 'ip = :ip';
                const tableName:string = `tno${this.tenentId}logins`;
                const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
                return {queryStr , queryData : {ip}};
            },

            byJti : (ignorePagination:boolean,jti:string,...fields:Field[]):IQuery=>{
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}logins`;
                const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
                return {queryStr , queryData : {jti}};
            },

            byClientId : (ignorePagination:boolean,clientId:number,...fields:Field[]):IQuery=>{
                const condition:string = 'clientId = :clientId';
                const tableName:string = `tno${this.tenentId}logins`;
                const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
                return {queryStr , queryData : {clientId}};
            }
        }

        /**
         * you cannot update any records from the log
         */
        this.update = {}

        /**
         * you cannot delete any records from the log
         */
        this.delete = {}
    }

    public get id():number{
        return this.tenentId;
    }

    public createTable(engine:StorageEngine):IQuery{
        const fieldsString:string = defienetionString(this.fields);
        const queryStr:string = `CREATE TABLE IF NOT EXISTS tno${this.tenentId}logins (
            ${fieldsString},
            FOREIGN KEY (jti) REFERENCES tno${this.tenentId}tokens(jti) ON DELETE SET NULL ON UPDATE CASCADE
        )ENGINE=${engine};`;

        return {queryStr , queryData : {}};
    }

    public insertLogin(data:object):IQuery{
        const queryStr:string = insertString(this.fields,`tno${this.tenentId}logins`);;

        return {queryStr,queryData : data};
    }
}