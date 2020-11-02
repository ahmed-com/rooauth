import Field from "../Field";
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString, constructSelect, constructUpdate} from '../utils';
import constructDelete from "../utils/constructDelete";
import IQuery from "../IQuery";
import IClientFieldCollection from "./interfaces/IClientFieldCollection";
import IClientSelectionCollection from "./interfaces/IClientSelectionCollection";
import IClientUpdateCollection from "./interfaces/IClientUpdateCollection";
import IClientDeletionCollection from "./interfaces/IClientDeletionCollection";

export default class ClientQG{

    static fields:IClientFieldCollection = {

        clientId : {
            name : 'clientId',
            definetion : 'clientId INTEGER UNSIGNED NOT NULL UNIQUE auto_increment',
            insertionValue : 'DEFAULT',
            updateValue : ':clientId'
        },

        clientSecret : {
            name : 'clientSecret',
            definetion : 'clientSecret VARCHAR(255) NOT NULL',
            insertionValue : ':clientId',
            updateValue : ':clientId'
        },

        userId : {
            name : 'userId',
            definetion : 'userId INTEGER UNSIGNED NOT NULL',
            insertionValue : ':userId',
            updateValue : ':userId'
        },

        tenentId : {
            name : 'tenentId',
            definetion : 'tenentId INTEGER UNSIGNED NOT NULL',
            insertionValue : ':tenentId',
            updateValue : ':tenentId'
        }

    }

    static readableFields = {
        ...ClientQG.fields
    };

    static writableFields = {
        clientSecret : ClientQG.fields.clientSecret,
        userId : ClientQG.fields.userId,
        tenentId : ClientQG.fields.tenentId
    };

    static select:IClientSelectionCollection = {

        all : (queryData:{limit?:number, offset?:number},...fields:Field[]):IQuery=>{
            const condition:string = '';
            const tableName:string = `clients`;
            const paginationStr:string = pagination(queryData);
            const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
            return {queryStr,queryData}
        },

        byClientId : (queryData:{clientId:number,limit?:number, offset?:number},...fields:Field[]):IQuery=>{
            const condition:string = 'clientId = :clientId';
            const tableName:string = `clients`;
            const paginationStr:string = pagination(queryData);
            const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
            return {queryStr , queryData };
        },

        byTenentId : (queryData:{tenentId:number, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
            const condition:string = 'tenentId = :tenentId';
            const tableName:string = `clients`;
            const paginationStr:string = pagination(queryData);
            const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
            return {queryStr , queryData };
        },

        byUserId : (queryData:{userId:number, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
            const condition:string = 'userId = :userId';
            const tableName:string = `clients`;
            const paginationStr:string = pagination(queryData);
            const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
            return {queryStr , queryData }
        }

    }

    static update:IClientUpdateCollection = {

        all : (queryData:object,...fields:Field[]):IQuery => {
            const condition:string = '';
            const tableName:string = 'clients';
            const queryStr:string = constructUpdate(fields,tableName,condition);
            return {queryStr , queryData };
        },

        byClientId : (queryData:{clientId:number},...fields:Field[]):IQuery => {
            const condition:string = ' clientId = :clientId ';
            const tableName:string = 'clients';
            const queryStr:string = constructUpdate(fields,tableName,condition);
            return {queryStr , queryData };
        },

        byTenentId : (queryData:{tenentId:number},...fields:Field[]):IQuery => {
            const condition:string = ' tenentId = :tenentId ';
            const tableName:string = 'clients';
            const queryStr:string = constructUpdate(fields,tableName,condition);
            return {queryStr , queryData };
        },

        byUserId : (queryData:{userId:number},...fields:Field[]) => {
            const condition:string = ' userId = :userId ';
            const tableName:string = 'clients';
            const queryStr:string = constructUpdate(fields,tableName,condition);
            return {queryStr , queryData };
        }

    }

    static delete:IClientDeletionCollection = {

        all : (queryData:{limit?:number , offset?:number}):IQuery => {
            const condition:string = '';
            const tableName:string = 'clients';
            const paginationStr:string = pagination(queryData);
            const queryStr:string = constructDelete(tableName,condition,paginationStr);
            return {queryStr , queryData };
        },

        byClientId : (queryData:{clientId:number , limit?:number, offset?:number}):IQuery => {
            const condition:string = 'clientId = :clientId';
            const tableName:string = 'clients';
            const paginationStr:string = pagination(queryData);
            const queryStr:string = constructDelete(tableName,condition,paginationStr);
            return {queryStr , queryData };
        },

        byTenentId : (queryData:{tenentId:number, limit?:number, offset?:number}):IQuery => {
            const condition:string = 'tenentId = :tenentId';
            const tableName:string = 'clients';
            const paginationStr:string = pagination(queryData);
            const queryStr:string = constructDelete(tableName,condition,paginationStr);
            return {queryStr , queryData};
        },

        byUserId : (queryData:{userId:number, limit?:number, offset?:number}):IQuery => {
            const condition:string = 'userId = :userId';
            const tableName:string = 'clients';
            const paginationStr:string = pagination(queryData);
            const queryStr:string = constructDelete(tableName,condition,paginationStr);
            return {queryStr , queryData };
        }

    }

    public static createTable(engine:StorageEngine):IQuery{
        const allFields:Field[] = Object.values(ClientQG.fields);
        const fieldsString:string = defienetionString(allFields);
        const queryStr:string = `CREATE TABLE IF NOT EXISTS clients(
            ${fieldsString},
            FOREIGN KEY (tenentId) REFERENCES tenents(tenentId) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${engine};`

        return {queryStr , queryData:{}};
    }

    public static insertClient(queryData:object):IQuery{
        const allFields:Field[] = Object.values(ClientQG.fields);
        const queryStr:string = insertString (allFields,`clients`);

        return {queryStr , queryData };
    }

}