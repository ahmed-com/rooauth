import InsertionField from "./InsertionFieldsInterface";
import StorageEngines from "./StorageEnginesEnum";

export default class SessionQG{
    private verified_default:string;

    constructor(
        private tenentId:number,
        private extraInsertionFields:InsertionField,
        private extraFields:string
    ){
        this.verified_default = 'FALSE';
    }

    public createTable(engine:StorageEngines):string{
        return `CREATE TABLE IF NOT EXISTS tno${this.tenentId}tokens (
            jti INTEGER UNSIGNED NOT NULL UNIQUE auto_increment,
            sub INTEGER UNSIGNED NOT NULL,
            exp DATETIME NOT NULL,
            verified BOOLEAN NOT NULL DEFAULT ${this.verified_default},
            ${this.extraFields}
            PRIMARY KEY (jti),
            FOREIGN KEY (sub) REFERENCES tno${this.tenentId}subjects(id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${engine};`;
    }

    public insertSession():string{
        return ``
    }
}