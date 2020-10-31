import Field from "../Field";
import FieldCollection from '../FieldCollection';
import SelectionCollection from "../SelectionCollection";
import UpdateCollection from "../UpdateCollection";
import DeleteCollection from '../DeletionCollection';
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString, constructSelect, constructUpdate} from '../utils';
import constructDelete from "../utils/constructDelete";
import IQuery from "../IQuery";

export default class ClientQG{

    static fields:FieldCollection = {

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

    static readableFields:FieldCollection = {
        ...ClientQG.fields
    };

    static writableFields:FieldCollection = {
        ...ClientQG.fields
    };

    static select:SelectionCollection = {

        all : (ignorePagination:boolean,...fields:Field[]):IQuery=>{
            const condition:string = '';
            const tableName:string = `clients`;
            const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
            return {queryStr,queryData : {}}
        },

        byClientId : (_:boolean,clientId:number,...fields:Field[]):IQuery=>{
            const condition:string = 'clientId = :clientId';
            const tableName:string = `clients`;
            const queryStr:string = constructSelect(fields,tableName,condition,"LIMIT 1;");
            return {queryStr , queryData : {clientId}};
        },

        byTenentId : (ignorePagination:boolean,tenentId,...fields:Field[]):IQuery=>{
            const condition:string = 'tenentId = :tenentId';
            const tableName:string = `clients`;
            const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
            return {queryStr , queryData : {tenentId}}
        },

        byUserId : (ignorePagination:boolean,userId:number,...fields:Field[]):IQuery=>{
            const condition:string = 'userId = :userId';
            const tableName:string = `clients`;
            const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
            return {queryStr , queryData : {userId}}
        }

    }

    static update:UpdateCollection = {

        all : (...fields:Field[]):IQuery => {
            const condition:string = '';
            const tableName:string = 'clients';
            const queryStr:string = constructUpdate(fields,tableName,condition);
            return {queryStr , queryData : {}};
        },

        byClientId : (clientId:number,...fields:Field[]):IQuery => {
            const condition:string = ' clientId = :clientId ';
            const tableName:string = 'clients';
            const queryStr:string = constructUpdate(fields,tableName,condition);
            return {queryStr , queryData : {clientId}};
        },

        byTenentId : (tenentId:number,...fields:Field[]):IQuery => {
            const condition:string = ' tenentId = :tenentId ';
            const tableName:string = 'clients';
            const queryStr:string = constructUpdate(fields,tableName,condition);
            return {queryStr , queryData : {tenentId}};
        },

        byUserId : (userId:number,...fields:Field[]) => {
            const condition:string = ' userId = :userId ';
            const tableName:string = 'clients';
            const queryStr:string = constructUpdate(fields,tableName,condition);
            return {queryStr , queryData : {userId}};
        }

    }

    static delete:DeleteCollection = {

        all : ():IQuery => {
            const condition:string = '';
            const tableName:string = 'clients';
            const queryStr:string = constructDelete(tableName,condition);
            return {queryStr , queryData : {}};
        },

        byClientId : (clientId:number):IQuery => {
            const condition:string = 'clientId = :clientId';
            const tableName:string = 'clients';
            const queryStr:string = constructDelete(tableName,condition);
            return {queryStr , queryData : {clientId}};
        },

        byTenentId : (tenentId:number):IQuery => {
            const condition:string = 'tenentId = :tenentId';
            const tableName:string = 'clients';
            const queryStr:string = constructDelete(tableName,condition);
            return {queryStr , queryData : {tenentId}};
        },

        byUserId : (userId:number):IQuery => {
            const condition:string = 'userId = :userId';
            const tableName:string = 'clients';
            const queryStr:string = constructDelete(tableName,condition);
            return {queryStr , queryData : {userId}};
        }

    }

    public static createTable(engine:StorageEngine):IQuery{
        const fieldsString:string = defienetionString(ClientQG.fields);
        const queryStr:string = `CREATE TABLE IF NOT EXISTS clients(
            ${fieldsString},
            FOREIGN KEY (tenentId) REFERENCES tenents(tenentId) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${engine};`

        return {queryStr , queryData:{}};
    }

    public static insertClient(data:object):IQuery{
        const queryStr:string = insertString (ClientQG.fields,`clients`);

        return {queryStr , queryData : data};
    }

}