import InsertionField from "./InsertionFieldsInterface";
import StorageEngine from "./StorageEngineEnum";

export default class LoginsQG {

    private loggedAt_default:string;

    constructor(
        private tenentId:number,
        private extraInsertionFields:InsertionField,
        private extraFields:string
    ){
        this.loggedAt_default = 'NOW()';
    }

    public createTable(engine:StorageEngine):string{
        return `CREATE TABLE IF NOT EXISTS tno${this.tenentId}logins (
            subject_id INTEGER UNSIGNED NOT NULL,
            jti INTEGER UNSIGNED NULL,
            password_login BOOLEAN NOT NULL,
            client_id INTEGER UNSIGNED NOT NULL,
            ip CHAR(39) NOT NULL,
            logged_at DATETIME NOT NULL DEFAULT ${this.loggedAt_default},
            device_info VARCHAR(255) NULL,
            ${this.extraFields}
            FOREIGN KEY (jti) REFERENCES tno${this.tenentId}tokens(jti) ON DELETE SET NULL ON UPDATE CASCADE
        )ENGINE=${engine};`;
    }

    /**
     * @summary
     * {jti?:number, passwordLogin:boolean, clientId:number, ip:string, loggedAt?:date, deviceInfo?:string}
     */
    public insertLogin():string{
        return `
        INSERT INTO tno${this.tenentId}logins(
            subject_id,
            jti,
            password_login,
            client_id,
            ip,
            logged_at,
            ${this.extraInsertionFields.fields}
            device_info
        )VALUES(
            DEFAULT,
            :jti,
            :passwordLogin,
            :clientId,
            :ip,
            IFNULL(:loggedAt,${this.loggedAt_default}),
            ${this.extraInsertionFields.values}
            :deviceInfo
        );`;
    }

    /**
     * @summary
     * {subject:number , limit?:number, offset?:number}
     */
    public selectLoginsBySubject(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return `SELECT * FROM tno${this.tenentId}logins WHERE subject_id = :subject` + pagination;
    }

    /**
     * @summary
     * {ip:number , limit?:number, offset?:number}
     */
    public selectLoginsByIp(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return `SELECT * FROM tno${this.tenentId}logins WHERE ip = :ip` + pagination;
    }

    /**
     * @summary
     * {jti:number , limit?:number, offset?:number}
     */
    public selectLoginsByJti(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return `SELECT * FROM tno${this.tenentId}logins WHERE jti = :jti` + pagination;
    }

    /**
     * @summary
     * {clientId:number , limit?:number, offset?:number}
     */
    public selectLoginsByClientId(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return `SELECT * FROM tno${this.tenentId}logins WHERE client_id = :clientId` + pagination;
    }

    /**
     * @summary
     * {date:date , limit?:number, offset?:number}
     */
    public selectLoginsAfterDate(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return `SELECT * FROM tno${this.tenentId}logins WHERE logged_at > :date` + pagination;
    }

    /**
     * @summary
     * {date:date , limit?:number, offset?:number}
     */
    public selectLoginsBeforeDate(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return `SELECT * FROM tno${this.tenentId}logins WHERE logged_at < :date` + pagination;
    }
}