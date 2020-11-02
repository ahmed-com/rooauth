import StorageEngine from "../StorageEngineEnum";
import { pagination , defienetionString, insertString, constructSelect, constructUpdate } from "../utils";
import Field from '../Field';
import IQuery from '../IQuery';
import LoginFieldCollection from "./interfaces/LoginFieldCollection";
import LoginSelectionCollection from "./interfaces/LoginSelectionCollection";

export default class LoginQG{

    public fields:LoginFieldCollection;
    public readableFields:LoginFieldCollection;

    public select:LoginSelectionCollection;

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

        this.select = {

            all : (queryData:{limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}logins`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            bySubjectId : (queryData:{subjectId:number, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = 'subjectId = :subjectId';
                const tableName:string = `tno${this.tenentId}logins`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            byIp : (queryData:{ip:string, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = 'ip = :ip';
                const tableName:string = `tno${this.tenentId}logins`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            byJti : (queryData:{jti:number, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}logins`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            byClientId : (queryData:{clientId:number, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = 'clientId = :clientId';
                const tableName:string = `tno${this.tenentId}logins`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
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
        const queryStr:string = `CREATE TABLE IF NOT EXISTS tno${this.tenentId}logins (
            ${fieldsString},
            FOREIGN KEY (jti) REFERENCES tno${this.tenentId}tokens(jti) ON DELETE SET NULL ON UPDATE CASCADE
        )ENGINE=${engine};`;

        return {queryStr , queryData : {}};
    }

    public insertLogin(queryData:object):IQuery{
        const allFields:Field[] = Object.values(this.fields);
        const queryStr:string = insertString(allFields,`tno${this.tenentId}logins`);;

        return {queryStr,queryData };
    }
}