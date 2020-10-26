import Field from "../Field";
import FieldCollection from '../FieldCollection';
import SelectionCollection from "../SelectionCollection";
import StorageEngine from "../StorageEngineEnum";
import {pagination , insertString, defienetionString, constructSelect} from '../utils';

export default class IpQG{

    static fields:FieldCollection = {
        
        ip : {
            name :'ip',
            definetion : 'ip CHAR(39) NOT NULL',
            insertionValue : ':ip',
            updateValue : ':ip'
        },

        tenentId : {
            name : 'tenent_id',
            definetion : 'tenent_id INTEGER UNSIGNED NOT NULL',
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

        byTenentId : (ignorePagination:boolean,...fields:Field[]):string=>{
            const condition:string = 'tenent_id = :tenentId';
            const tableName:string = `ips`;
            return constructSelect(fields,tableName,condition,pagination(ignorePagination));
        }

    }

    public static createTable(engine:StorageEngine):string{
        const fieldsString:string = defienetionString(IpQG.fields);

        return `CREATE TABLE IF NOT EXISTS ips(
            ${fieldsString}
            FOREIGN KEY (tenent_id) REFERENCES tenents(tenent_id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${engine};`;
    }

    public static insertIp():string{
        return insertString (IpQG.fields,`ips`);
    }

}