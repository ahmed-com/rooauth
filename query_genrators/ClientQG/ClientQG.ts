import Field from "../Field";
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString, constructSelect, constructUpdate} from '../utils';
import constructDelete from "../utils/constructDelete";
import IQuery from "../IQuery";
import IClientFieldCollection from "./interfaces/ClientFieldCollection";
import IClientSelectionCollection from "./interfaces/ClientSelectionCollection";
import IClientUpdateCollection from "./interfaces/ClientUpdateCollection";
import IClientDeletionCollection from "./interfaces/ClientDeletionCollection";

export default class ClientQG{

    static fields:IClientFieldCollection = {

        clientId : {
            name : 'clientId',
            definetion : 'clientId INTEGER UNSIGNED NOT NULL UNIQUE auto_increment',
            insertionValue : 'DEFAULT',
            updateValue : ':clientId'
        },

        clientSecretHash : {
            name : 'clientSecretHash',
            definetion : 'clientSecretHash VARCHAR(255) NOT NULL',
            insertionValue : ':clientSecretHash',
            updateValue : ':clientSecretHash'
        },

        details : {
            name : 'details',
            definetion : 'details VARCHAR(255) UNSIGNED NULL',
            insertionValue : ':details',
            updateValue : ':details'
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
        clientSecretHash : ClientQG.fields.clientSecretHash,
        details : ClientQG.fields.details
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

    public doExist(queryData:{clientId:number}):IQuery{
        const queryStr:string = `SELECT EXISTS( SELECT clientId FROM clients WHERE clientId = :clientId LIMIT 1 ) AS bool;`

        return {queryStr , queryData };
    }

}