import Field from "../Field";
import FieldCollection from '../FieldCollection';
import SelectionCollection from "../SelectionCollection";
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString, constructSelect} from '../utils';

export default class ClientQG{

    static fields:FieldCollection = {

        clientId : {
            name : 'client_id',
            definetion : 'client_id INTEGER UNSIGNED NOT NULL UNIQUE auto_increment',
            insertionValue : 'DEFAULT',
            updateValue : ':clientId'
        },

        clientSecret : {
            name : 'client_secret',
            definetion : 'client_secret VARCHAR(255) NOT NULL',
            insertionValue : ':clientId',
            updateValue : ':clientId'
        },

        userId : {
            name : 'user_id',
            definetion : 'user_id INTEGER UNSIGNED NOT NULL',
            insertionValue : ':userId',
            updateValue : ':userId'
        },

        tenentId : {
            name : 'tenent_id',
            definetion : 'tenent_id INTEGER UNSIGNED NOT NULL',
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

        all : (ignorePagination:boolean,...fields:Field[]):string=>{
            const condition:string = '';
            const tableName:string = `clients`;
            return constructSelect(fields,tableName,condition,pagination(ignorePagination));
        },

        byClientId : (_:boolean,...fields:Field[]):string=>{
            const condition:string = 'client_id = :clientId';
            const tableName:string = `clients`;
            return constructSelect(fields,tableName,condition,"LIMIT 1;");
        },

        byTenentId : (ignorePagination:boolean,...fields:Field[]):string=>{
            const condition:string = 'tenent_id = :tenentId';
            const tableName:string = `clients`;
            return constructSelect(fields,tableName,condition,pagination(ignorePagination));
        },

        byUserId : (ignorePagination:boolean,...fields:Field[]):string=>{
            const condition:string = 'user_id = :userId';
            const tableName:string = `clients`;
            return constructSelect(fields,tableName,condition,pagination(ignorePagination));
        },

    }

    public static createTable(engine:StorageEngine):string{
        const fieldsString:string = defienetionString(ClientQG.fields);

        return `CREATE TABLE IF NOT EXISTS clients(
            ${fieldsString},
            FOREIGN KEY (tenent_id) REFERENCES tenents(tenent_id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${engine};`
    }

    public static insertClient():string{
        return insertString (ClientQG.fields,`clients`);
    }

}