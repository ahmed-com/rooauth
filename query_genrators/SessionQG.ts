import InsertionField from "./InsertionFieldsInterface";
import StorageEngines from "./StorageEnginesEnum";

export default class SessionQG{

    constructor(
        private tenentId:number,
        private extraInsertionFields:InsertionField,
        private extraFields:string
    ){
        
    }

    public createTable(engine:StorageEngines):string{
        return `CREATE TABLE IF NOT EXISTS tno${this.tenentId}tokens (
            jti INTEGER UNSIGNED NOT NULL UNIQUE auto_increment,
            sub INTEGER UNSIGNED NOT NULL,
            exp DATETIME NOT NULL,
            ${this.extraFields}
            PRIMARY KEY (jti),
            FOREIGN KEY (sub) REFERENCES tno${this.tenentId}subjects(id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${engine};`;
    }

    /**
     * @summary
     * {sub:number,exp:date,verified?:boolean}
     */
    public insertSession():string{
        return `INSERT INTO tno${this.tenentId}tokens(
            jti,
            sub,
            ${this.extraInsertionFields.fields}
            exp
        )VALUES(
            DEFAULT,
            :sub,
            ${this.extraInsertionFields.values}
            :exp
        );`;
    }

    /**
     * @summary
     * {jti:number}
     */
    public selectTokenById():string{
        return `SELECT * FROM tno${this.tenentId}tokens WHERE jti=:jti LIMIT 1;`;
    }

    /**
     * @summary
     * {date:date , limit?:number , offset?:number}
     */
    public selectTokensExpiredBeforeDate(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return `SELECT * FROM tno${this.tenentId}tokens WHERE exp < :date` + pagination;
    }

    /**
     * @summary
     * {sub:number , limit?:number , offset?:number}
     */
    public selectTokensBySubject(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return `SELECT * FROM tno${this.tenentId}tokens WHERE sub = :sub` + pagination;
    }
}