import InsertionField from "../InsertionFieldsInterface";
import StorageEngine from "../StorageEngineEnum";
import { pagination } from "../utils";

export default class LoginQG{

    public extraInsertionFields:InsertionField;
    public extraFields:string;

    constructor(
        private tenentId:number
    ){
        this.extraFields = '';
        this.extraInsertionFields = {fields : '' , values : ''};
    }

    public get id():number{
        return this.tenentId;
    }

    public createTable(engine:StorageEngine):string{
        return `CREATE TABLE IF NOT EXISTS tno${this.tenentId}logins (
            subject_id INTEGER UNSIGNED NOT NULL,
            jti INTEGER UNSIGNED NULL,
            password_login BOOLEAN NOT NULL,
            client_id INTEGER UNSIGNED NOT NULL,
            ip CHAR(39) NOT NULL,
            ${this.extraFields}
            FOREIGN KEY (jti) REFERENCES tno${this.tenentId}tokens(jti) ON DELETE SET NULL ON UPDATE CASCADE
        )ENGINE=${engine};`;
    }

    /**
     * @summary
     * {jti?:number, passwordLogin:boolean, clientId:number, ip:string}
     */
    public insertLogin():string{
        return `
        INSERT INTO tno${this.tenentId}logins(
            subject_id,
            jti,
            password_login,
            client_id,
            ${this.extraInsertionFields.fields}
            ip
        )VALUES(
            DEFAULT,
            :jti,
            :passwordLogin,
            :clientId,
            ${this.extraInsertionFields.values}
            :ip
        );`;
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