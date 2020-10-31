import Field from "../Field";
import FieldCollection from '../FieldCollection';
import SelectionCollection from "../SelectionCollection";
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString, constructSelect} from '../utils';
import IQuery from "../IQuery";

export default class IpQG{

    static fields:FieldCollection = {
        
        ip : {
            name :'ip',
            definetion : 'ip CHAR(39) NOT NULL',
            insertionValue : ':ip',
            updateValue : ':ip'
        },

        tenentId : {
            name : 'tenentId',
            definetion : 'tenentId INTEGER UNSIGNED NOT NULL',
            insertionValue : ':tenentId',
            updateValue : ':tenentId'
        }

    }

    static readableFields:FieldCollection = {
        ...IpQG.fields
    };

    static writableFields:FieldCollection = {
        ...IpQG.fields
    };

    static select:SelectionCollection = {

        byTenentId : (queryData:{tenentId:number, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
            const condition:string = 'tenentId = :tenentId';
            const tableName:string = `ips`;
            const paginationStr:string = pagination(queryData);
            const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
            return {queryStr , queryData }
        }

    }

    public static createTable(engine:StorageEngine):IQuery{
        const fieldsString:string = defienetionString(IpQG.fields);
        const queryStr:string = `CREATE TABLE IF NOT EXISTS ips(
            ${fieldsString}
            FOREIGN KEY (tenentId) REFERENCES tenents(tenentId) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${engine};`;

        return {queryStr , queryData : {}};
    }

    public static insertIp(queryData:object):IQuery{
        const queryStr:string = insertString (IpQG.fields,`ips`);

        return {queryStr , queryData };
    }

}