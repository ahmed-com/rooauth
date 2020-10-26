import FieldCollection from '../FieldCollection';
import StorageEngine from "../StorageEngineEnum";
import { pagination , defienetionString, insertString } from "../utils";

export default class LoginQG{

    public fields:FieldCollection;
    public readableFields:FieldCollection;
    public writableFields:FieldCollection;

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
            subjectId : this.fields.subjectId,
            jti : this.fields.jti,
            passwordLogin: this.fields.passwordLogin,
            clientId : this.fields.clientId,
            ip : this.fields.ip
        }

        this.writableFields = {}
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

    /**
     * @summary
     * {jti?:number, passwordLogin:boolean, clientId:number, ip:string}
     */
    public insertLogin():string{
        return insertString(this.fields,`tno${this.tenentId}logins`);
    }

    /**
     * @summary
     * {subject:number , limit?:number, offset?:number}
     */
    public selectLoginsBySubject(ignorePagination:boolean):string{
        return `SELECT * FROM tno${this.tenentId}logins WHERE subject_id = :subject` + pagination(ignorePagination);
    }

    /**
     * @summary
     * {ip:number , limit?:number, offset?:number}
     */
    public selectLoginsByIp(ignorePagination:boolean):string{
        return `SELECT * FROM tno${this.tenentId}logins WHERE ip = :ip` + pagination(ignorePagination);
    }

    /**
     * @summary
     * {jti:number , limit?:number, offset?:number}
     */
    public selectLoginsByJti(ignorePagination:boolean):string{
        return `SELECT * FROM tno${this.tenentId}logins WHERE jti = :jti` + pagination(ignorePagination);
    }

    /**
     * @summary
     * {clientId:number , limit?:number, offset?:number}
     */
    public selectLoginsByClientId(ignorePagination:boolean):string{
        return `SELECT * FROM tno${this.tenentId}logins WHERE client_id = :clientId` + pagination(ignorePagination);
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