import Field from "../Field";
import FieldCollection from '../FieldCollection';
import StorageEngine from "../StorageEngineEnum";
import SelectionCollection from "../SelectionCollection";
import {pagination , insertString, defienetionString, constructSelect} from '../utils';

export default class SubjectQG{

    public fields:FieldCollection;
    public readableFields:FieldCollection;
    public writableFields:FieldCollection;

    private enableMfa_default:string;
    private accountVerified_default:string;

    public select:SelectionCollection;

    constructor(
        private tenentId:number
    ){

        this.enableMfa_default = `(SELECT tenents.mfa_enable_default FROM tenents WHERE tenents.tenent_id = ${this.tenentId} LIMIT 1)`;
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
                name : 'password_hash',
                definetion:'password_hash VARCHAR(255) NOT NULL',
                insertionValue:':passwordHash',
                updateValue:':passwordHash'
            },

            oldPasswordHash : {
                name : 'old_password_hash',
                definetion : 'old_password_hash VARCHAR(255) NULL',
                insertionValue : ':oldPasswordHash',
                updateValue : ':oldPasswordHash'
            },

            passwordChangedAt : {
                name : 'password_changed_at',
                definetion : 'password_changed_at DATETIME NULL',
                insertionValue : ':passwordChangedAt',
                updateValue : ':passwordChangedAt'
            },

            enableMfa : {
                name : 'enable_mfa',
                definetion : 'enable_mfa BOOLEAN NOT NULL',
                default : this.enableMfa_default,
                insertionValue : `IFNULL(:enableMfa,${this.enableMfa_default})`,
                updateValue : ':enableMfa'
            },

            accountVerified : {
                name: 'account_verified',
                definetion : `account_verified BOOLEAN NOT NULL DEFAULT ${this.accountVerified_default}`,
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

            byId : (_:boolean,...fields:Field[]):string=>{
                const condition:string = 'id = :id';
                const tableName:string = `tno${this.tenentId}subjects`;
                return constructSelect(fields,tableName,condition,"LIMIT 1");
            },

            byAccount : (_:boolean,...fields:Field[]):string=>{
                const condition:string = 'id = :id';
                const tableName:string = `tno${this.tenentId}subjects`;
                return constructSelect(fields,tableName,condition,"LIMIT 1");
            }

        }
        
    }

    public get id():number{
        return this.tenentId;
    }

    public createTable(engine:StorageEngine):string{
        const fieldsString:string = defienetionString(this.fields);

        return `CREATE TABLE IF NOT EXISTS tno${this.tenentId}subjects (
            ${fieldsString},
            PRIMARY KEY (id)
        ) ENGINE=${engine};`;
    }

    public insertSubject():string{
        return insertString (this.fields,`tno${this.tenentId}subjects`)
    }

    /**
     * @deprecated
     */
    public enableMfaByDefaul():string{
        return `ALTER TABLE tno${this.tenentId}subjects ALTER enable_mfa SET DEFAULT TRUE;`
    }

    /**
     * @deprecated
     */
    public disableMfaByDefault():string{
        return `ALTER TABLE tno${this.tenentId}subjects ALTER enable_mfa SET DEFAULT FALSE;`
    }
}