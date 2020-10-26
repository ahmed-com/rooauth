import SelectionCollection from '../SelectionCollection';
import FieldCollection from '../FieldCollection';
import StorageEngine from "../StorageEngineEnum";
import { defienetionString, insertString, constructSelect } from "../utils";
import Field from '../Field';

export default class LoginQG{

    public fields:FieldCollection;
    public readableFields:FieldCollection;
    public writableFields:FieldCollection;

    public select:SelectionCollection;

    constructor(
        private tenentId:number
    ){

        this.fields = {
            subjectId : {
                name : 'subject_id',
                definetion: 'subject_id INTEGER UNSIGNED NOT NULL',
                insertionValue: ':subjectId',
                updateValue: ':subjectId'
            },

            jti : {
                name : 'jti',
                definetion : 'jti INTEGER UNSIGNED NULL',
                insertionValue : ':jti',
                updateValue : ':jti'
            },

            passwordLogin : {
                name : 'password_login',
                definetion : 'password_login BOOLEAN NOT NULL',
                insertionValue : ':passwordLogin',
                updateValue : ':passwordLogin'
            },

            clientId : {
                name : 'client_id',
                definetion : 'client_id INTEGER UNSIGNED NOT NULL',
                insertionValue : ':clientId',
                updateValue : ':clientId'
            },
            
            ip : {
                name : 'ip',
                definetion : 'CHAR(39) NOT NULL',
                insertionValue : ':ip',
                updateValue : ':ip'
            }
        }

        this.readableFields = {
            ...this.fields
        }

        this.writableFields = {}

        this.select = {

            bySubject : (ignorePagination?:boolean,...fields:Field[]):string=>{
                const pagination:boolean = ignorePagination === undefined ? false : ignorePagination;
                const condition:string = 'subject_id = :subject';
                const tableName:string = `tno${this.tenentId}logins`;
                return constructSelect(fields,tableName,condition,pagination);
            },

            byIp : (ignorePagination?:boolean,...fields:Field[]):string=>{
                const pagination:boolean = ignorePagination === undefined ? false : ignorePagination;
                const condition:string = 'ip = :ip';
                const tableName:string = `tno${this.tenentId}logins`;
                return constructSelect(fields,tableName,condition,pagination);
            },

            byJti : (ignorePagination?:boolean,...fields:Field[]):string=>{
                const pagination:boolean = ignorePagination === undefined ? false : ignorePagination;
                const condition:string = 'jti = :jti';
                const tableName:string = `tno${this.tenentId}logins`;
                return constructSelect(fields,tableName,condition,pagination);
            },

            byClientId : (ignorePagination?:boolean,...fields:Field[]):string=>{
                const pagination:boolean = ignorePagination === undefined ? false : ignorePagination;
                const condition:string = 'client_id = :clientId';
                const tableName:string = `tno${this.tenentId}logins`;
                return constructSelect(fields,tableName,condition,pagination);
            }
        }
    }

    public get id():number{
        return this.tenentId;
    }

    public createTable(engine:StorageEngine):string{
        const fieldsString:string = defienetionString(this.fields);
        
        return `CREATE TABLE IF NOT EXISTS tno${this.tenentId}logins (
            ${fieldsString},
            FOREIGN KEY (jti) REFERENCES tno${this.tenentId}tokens(jti) ON DELETE SET NULL ON UPDATE CASCADE
        )ENGINE=${engine};`;
    }

    public insertLogin():string{
        return insertString(this.fields,`tno${this.tenentId}logins`);
    }

    // /**
    //  * @summary
    //  * {date:date , limit?:number, offset?:number}
    //  */
    // public selectLoginsAfterDate(ignorePagination:boolean):string{
    //     return `SELECT * FROM tno${this.tenentId}logins WHERE logged_at > :date` + pagination(ignorePagination);
    // }

    // /**
    //  * @summary
    //  * {date:date , limit?:number, offset?:number}
    //  */
    // public selectLoginsBeforeDate(ignorePagination:boolean):string{
    //     return `SELECT * FROM tno${this.tenentId}logins WHERE logged_at < :date` + pagination(ignorePagination);
    // }
}