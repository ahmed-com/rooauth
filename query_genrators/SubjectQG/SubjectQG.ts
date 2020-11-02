import Field from "../Field";
import FieldCollection from '../FieldCollection';
import StorageEngine from "../StorageEngineEnum";
import SelectionCollection from "../SelectionCollection";
import UpdateCollection from '../UpdateCollection';
import DeletionCollection from '../DeletionCollection';
import {pagination , insertString, defienetionString, constructSelect, constructUpdate} from '../utils';
import constructDelete from "../utils/constructDelete";
import IQuery from "../IQuery";

export default class SubjectQG{

    public fields:FieldCollection;
    public readableFields:FieldCollection;
    public writableFields:FieldCollection;

    private enableMfa_default:string;
    private accountVerified_default:string;

    public select:SelectionCollection;
    public update:UpdateCollection;
    public delete:DeletionCollection;

    constructor(
        private tenentId:number
    ){

        this.enableMfa_default = `(SELECT tenents.mfaDefault FROM tenents WHERE tenents.tenentId = ${this.tenentId} LIMIT 1)`;
        this.accountVerified_default = 'FALSE';

        this.fields = {
            id : {
                name : 'id',
                definetion : 'id INTEGER UNSIGNED NOT NULL UNIQUE auto_increment',
                insertionValue : 'DEFAULT',
                updateValue: ':id'
            },

            account :{
                name : 'account',
                definetion: 'account VARCHAR(255) NOT NULL UNIQUE',
                insertionValue: ':account',
                updateValue : ':account'
            },

            passwordHash :{
                name : 'passwordHash',
                definetion:'passwordHash VARCHAR(255) NOT NULL',
                insertionValue:':passwordHash',
                updateValue:':passwordHash'
            },

            oldPasswordHash : {
                name : 'oldPasswordHash',
                definetion : 'oldPasswordHash VARCHAR(255) NULL',
                insertionValue : ':oldPasswordHash',
                updateValue : ':oldPasswordHash'
            },

            passwordChangedAt : {
                name : 'passwordChangedAt',
                definetion : 'passwordChangedAt DATETIME NULL',
                insertionValue : ':passwordChangedAt',
                updateValue : ':passwordChangedAt'
            },

            enableMfa : {
                name : 'enableMfa',
                definetion : 'enableMfa BOOLEAN NOT NULL',
                default : this.enableMfa_default,
                insertionValue : `IFNULL(:enableMfa,${this.enableMfa_default})`,
                updateValue : ':enableMfa'
            },

            accountVerified : {
                name: 'accountVerified',
                definetion : `accountVerified BOOLEAN NOT NULL DEFAULT ${this.accountVerified_default}`,
                default : this.accountVerified_default,
                insertionValue : `IFNULL(:accountVerified,${this.accountVerified_default})`,
                updateValue : ':accountVerified'
            }
        }

        this.readableFields = {
            ...this.fields
        }

        this.writableFields = {
            ...this.fields
        }

        this.select = {

            all : (queryData:{limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}subjects`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            byId : (queryData:{id:number, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = 'id = :id';
                const tableName:string = `tno${this.tenentId}subjects`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData };
            },

            byAccount : (queryData:{account:string, limit?:number, offset?:number},...fields:Field[]):IQuery=>{
                const condition:string = 'account = :account';
                const tableName:string = `tno${this.tenentId}subjects`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructSelect(fields,tableName,condition,paginationStr);
                return {queryStr , queryData };
            }

        }

        this.update = {

            all : (queryData:object,...fields:Field[]):IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData };
            },

            byId : (queryData:{id:number},...fields:Field[]):IQuery=>{
                const condition:string = 'id = :id';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData };
            },

            byAccount : (queryData:{account:string},...fields:Field[]):IQuery=>{
                const condition:string = 'account = :account';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData };
            },

        },

        this.delete = {

            all : (queryData:{limit?:number, offset?:number}):IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}subjects`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructDelete(tableName,condition,paginationStr);
                return {queryStr , queryData};
            },
            
            byId : (queryData:{id:number, limit?:number, offset?:number}):IQuery=>{
                const condition:string = 'id = :id';
                const tableName:string = `tno${this.tenentId}subjects`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructDelete(tableName,condition,paginationStr);
                return {queryStr , queryData };
            },
            
            byAccount : (queryData:{account:string, limit?:number, offset?:number}):IQuery=>{
                const condition:string = 'account = :account';
                const tableName:string = `tno${this.tenentId}subjects`;
                const paginationStr:string = pagination(queryData);
                const queryStr:string = constructDelete(tableName,condition,paginationStr);
                return {queryStr , queryData };
            },
            
        }
        
    }

    public get id():number{
        return this.tenentId;
    }

    public createTable(engine:StorageEngine):IQuery{
        const fieldsString:string = defienetionString(this.fields);
        const queryStr:string = `CREATE TABLE IF NOT EXISTS tno${this.tenentId}subjects (
            ${fieldsString},
            PRIMARY KEY (id),
            INDEX account_index (account)
        ) ENGINE=${engine};`

        return {queryStr, queryData : {}};
    }

    public insertSubject(queryData:object):IQuery{
        const queryStr:string = insertString (this.fields,`tno${this.tenentId}subjects`);

        return {queryStr , queryData };
    }

    public doExist(queryData:{id:number}):IQuery{
        const queryStr:string = `SELECT EXISTS( SELECT id FROM tno${this.tenentId}subjects WHERE id = :id LIMIT 1 ) AS exists;`

        return {queryStr , queryData };
    }

}