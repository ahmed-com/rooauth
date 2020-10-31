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

            all : (ignorePagination:boolean,...fields:Field[]):IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
                return {queryStr , queryData : {}};
            },

            byId : (_:boolean,id:number,...fields:Field[]):IQuery=>{
                const condition:string = 'id = :id';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructSelect(fields,tableName,condition,"LIMIT 1");
                return {queryStr , queryData : {id}};
            },

            byAccount : (_:boolean,account:string,...fields:Field[]):IQuery=>{
                const condition:string = 'account = :account';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructSelect(fields,tableName,condition,"LIMIT 1");
                return {queryStr , queryData : {account}};
            }

        }

        this.update = {

            all : (...fields:Field[]):IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData : {}};
            },

            byId : (id:number,...fields:Field[]):IQuery=>{
                const condition:string = 'id = :id';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData : {id}};
            },

            byAccount : (account:string,...fields:Field[]):IQuery=>{
                const condition:string = 'account = :account';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructUpdate(fields,tableName,condition);
                return {queryStr , queryData : {account}};
            },

        },

        this.delete = {

            all : ():IQuery=>{
                const condition:string = '';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructDelete(tableName,condition);
                return {queryStr , queryData : {}};
            },
            
            byId : (id:number):IQuery=>{
                const condition:string = 'id = :id';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructDelete(tableName,condition);
                return {queryStr , queryData : {id}};
            },
            
            byAccount : (account:string):IQuery=>{
                const condition:string = 'account = :account';
                const tableName:string = `tno${this.tenentId}subjects`;
                const queryStr:string = constructDelete(tableName,condition);
                return {queryStr , queryData : {account}};
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
            PRIMARY KEY (id)
        ) ENGINE=${engine};`

        return {queryStr, queryData : {}};
    }

    public insertSubject(data:object):IQuery{
        const queryStr:string = insertString (this.fields,`tno${this.tenentId}subjects`);

        return {queryStr , queryData : data};
    }

}