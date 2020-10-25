import InsertionField from "./InsertionFieldsInterface";
import StorageEngine from "./StorageEngineEnum";

export default class SubjectQG{
    
    private oldPasswordHash_default:string;
    private passwordChangedAt_default:string;
    private enableMfa_default:string;
    private accountVerified_default:string;

    constructor(
        private tenentId:number,
        private extraInsertionFields:InsertionField,
        private extraFields:string
    ){
        this.oldPasswordHash_default = 'NULL';
        this.passwordChangedAt_default = 'NULL';
        this.enableMfa_default = `(SELECT tenents.mfa_enable_default FROM tenents WHERE tenents.tenent_id = ${this.tenentId} LIMIT 1)`;
        this.accountVerified_default = 'FALSE';
    }

    public createTable(engine:StorageEngine):string{
        return `CREATE TABLE IF NOT EXISTS tno${this.tenentId}subjects (
            id INTEGER UNSIGNED NOT NULL UNIQUE auto_increment,
            account VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            old_password_hash VARCHAR(255) NULL,
            password_changed_at DATETIME NULL,
            enable_mfa BOOLEAN NOT NULL,
            account_verified BOOLEAN NOT NULL DEFAULT ${this.accountVerified_default},
            ${this.extraFields}
            PRIMARY KEY (id)
        ) ENGINE=${engine};`;
    }

    /**
     * @summary
     * {account:string,passwordHash:string,oldPasswordHash?:string,passwordChangedAt?:date,enableMfa?:boolean,accountVerified:boolean}
     */
    public insertSubject():string{
        return `
        INSERT INTO tno${this.tenentId}subjects (
            id,
            account,
            password_hash,
            old_password_hash,
            password_changed_at,
            enable_mfa,
            ${this.extraInsertionFields.fields}
            account_verified
        )VALUES(
            DEFAULT,
            :account,
            :passwordHash,
            IFNULL(:oldPasswordHash,${this.oldPasswordHash_default}),
            IFNULL(:passwordChangedAt,${this.passwordChangedAt_default}),
            IFNULL(:enableMfa,${this.enableMfa_default}),
            ${this.extraInsertionFields.values}
            IFNULL(:accountVerified,${this.accountVerified_default})
        );`;
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

    /**
     * @summary
     * {id:number}
     */
    public selectSubjectById():string{
        return `SELECT * FROM tno${this.tenentId}subjects WHERE id=:id LIMIT 1;`;
    }

    /**
     * @summary
     * {account:string}
     */
    public selectSubjectsByAccount():string{
        return `SELECT * FROM tno${this.tenentId}subjects WHERE account=:account LIMIT 1;`;
    }
}