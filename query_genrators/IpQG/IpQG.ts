import Field from "../Field";
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString, constructSelect} from '../utils';
import IQuery from "../IQuery";
import IIpFieldCollection from "./interfaces/IpFieldCollection";
import IIpSelectionCollection from "./interfaces/IpSelectionCollection";

export default class IpQG{

    static fields:IIpFieldCollection = {
        
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

    static readableFields = {
        ...IpQG.fields
    };

    static writableFields = {
        ...IpQG.fields
    };

    static select:IIpSelectionCollection = {

        byTenentId : (queryData:{tenentId:number, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
            const condition:string = 'tenentId = :tenentId';
            const tableName:string = `ips`;
            const paginationStr:string = pagination(queryData);
            const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
            return {queryStr , queryData }
        }

    }

    public static createTable(engine:StorageEngine):IQuery{
        const allFields:Field[] = Object.values(IpQG.fields);
        const fieldsString:string = defienetionString(allFields);
        const queryStr:string = `CREATE TABLE IF NOT EXISTS ips(
            ${fieldsString}
            FOREIGN KEY (tenentId) REFERENCES tenents(tenentId) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${engine};`;

        return {queryStr , queryData : {}};
    }

    public static insertIp(queryData:object):IQuery{
        const allFields:Field[] = Object.values(IpQG.fields);
        const queryStr:string = insertString (allFields,`ips`);

        return {queryStr , queryData };
    }

}