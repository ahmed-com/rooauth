// enums
import StorageEngine from "./StorageEngineEnum";

// interfaces
import InsertionField from "./InsertionFieldsInterface";

// JSON
import config from "../config/config.json";

// classes
import SubjectQG from './SubjectQG';
import SessionQG from './SessionQG';
import LoginsQG from './LoginsQG';


export default class TenentQG {
    /**
     * making it possible to change the storage engine in the future
     */
    static subjectsTableEngine:StorageEngine = StorageEngine.InnoDB;
    static sessionsTableEngine:StorageEngine = StorageEngine.InnoDB;
    static loginsTableEngine:StorageEngine = StorageEngine.InnoDB;
    static tenentsTableEngine:StorageEngine = StorageEngine.InnoDB;
    static clientsTableEngine:StorageEngine = StorageEngine.InnoDB;
    static ipsTableEngine:StorageEngine = StorageEngine.InnoDB;

    /**
     * making it possible to add extra fields in the future via inheritance, without rewriting the whole queries 
     */
    static extraTenentFields:string = '';
    static extraClientFields:string = '';
    static extraIpFields:string = '';
    static extraTenentInsertionFields:InsertionField = {fields : '' , values : ''};
    static extraClientInsertionFields:InsertionField = {fields : '' , values : ''};
    static extraIpInsertionFields:InsertionField = {fields : '' , values : ''};

    /**
     * making it possible to adjust the available sizes in the DB without missing with the queries
     */
    static privateKeyLength:number = 255;
    static publicKeyLength:number = 255;

    /**
     * configurable by the server admin from the configuration files.
     */
    static defaultMaxSession:number = config.defaults.maxSession;
    static defaultIpRateLimit:number = config.defaults.ipRateLimit;
    static defaultMfaDefault:boolean = config.defaults.mfaDefault;
    static defaultIpWhiteListing:boolean = config.defaults.ipWhiteListing;
    static defaultStoreLogins:boolean = config.defaults.storeLogins;
    static defaultStoreCreatedAt:boolean = config.defaults.storeCreatedAt;
    static defaultStoreUpdatedAt:boolean = config.defaults.storeUpdatedAt;

    /**
     * these variables are meant to allow adding more features via decorators.
     */
    extraSubjectFields:string;
    extraSessionFields:string;
    extraLoginFields:string;
    extraSubjectInsertionFields:InsertionField;
    extraSessionInsertionFields:InsertionField;
    extraLoginInsertionFields:InsertionField;

    // ===========================================

    constructor(private tenentId:number){
        this.extraSubjectFields = '';
        this.extraLoginFields = '';
        this.extraSessionFields = '';
        this.extraSubjectInsertionFields = {fields : '' , values : ''};
        this.extraSessionInsertionFields = {fields : '' , values : ''};
        this.extraLoginInsertionFields = {fields : '' , values : ''};
    }

    get id():number{
        return this.tenentId;
    }

    static createTenentTable():string{
        return `CREATE TABLE IF NOT EXISTS tenents (
            tenent_id INTEGER UNSIGNED NOT NULL UNIQUE auto_increment,
            subject_schema JSON NULL,
            mfa_enable_default BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultMfaDefault},
            mfa_method VARCHAR (64),
            private_key VARCHAR(${TenentQG.privateKeyLength}),
            public_key VARCHAR(${TenentQG.publicKeyLength}),
            allow_ip_white_listing BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultIpWhiteListing},
            store_logins BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreLogins},
            store_created_at BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreCreatedAt},
            store_updated_at BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreUpdatedAt},
            max_session INTEGER NOT NULL DEFAULT ${TenentQG.defaultMaxSession},
            ip_rate_limit INTEGER NOT NULL DEFAULT ${TenentQG.defaultIpRateLimit},
            ${TenentQG.extraTenentFields}
            PRIMARY KEY (tenent_id)
        )ENGINE=${TenentQG.tenentsTableEngine};`;
    }

    static createIpsTable():string{
        return `CREATE TABLE IF NOT EXISTS ips(
            ip CHAR(39) NOT NULL,
            tenent_id INTEGER UNSIGNED NOT NULL,
            ${TenentQG.extraIpFields}
            FOREIGN KEY (tenent_id) REFERENCES tenents(tenent_id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${TenentQG.ipsTableEngine};`;
    }

    static createClientsTable():string{
        return `CREATE TABLE IF NOT EXISTS clients(
            client_id INTEGER UNSIGNED NOT NULL UNIQUE auto_increment,
            client_secret VARCHAR(255) NOT NULL,
            user_id INTEGER UNSIGNED NOT NULL,
            tenent_id INTEGER UNSIGNED NOT NULL,
            ${TenentQG.extraClientFields}
            FOREIGN KEY (tenent_id) REFERENCES tenents(tenent_id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${TenentQG.clientsTableEngine};`;
    }

    /**
     * @summary
     *  {tenent_id?:number ,subject_schema?:JSON , mfa_enable_default?:boolean , mfa_method:MFA , private_key:string , public_key:string , allow_ip_white_listing?:boolean , store_logins?:boolean , store_created_at?:boolean , store_updated_at?:boolean , max_session?:number , ip_rate_limit?:number}
     */
    static insertTenent():string{
        return "INSERT INTO tenents SET ?";
    }

    /**
     * @summary
     * {client_id?:number , client_secret:string , user_id:number , tenent_id:number}
     */
    static insertClient():string{
        return "INSERT INTO clients SET ?";
    }

    /**
     * @summary
     * {ip:string , tenent_id:number}
     */
    static insertIp():string{
        return "INSERT INTO ips SET ?"
    }

    /**
     * @summary
     * {id:number}
     */
    static getTenentById():string{
        return "SELECT * FROM tenents WHERE tenent_id = :id";
    }

    /**
     * @summary
     * {limit?:number , offset?:number}
     */
    static getAllTenents(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return "SELECT * FROM tenents" + pagination;
    }

    /**
     * @summary
     * {id:number}
     */
    static getClientById():string{
        return "SELECT * FROM clients WHERE client_id = :id";
    }

    /**
     * @summary
     * {tenentId:number , limit?:number , offset?:number}
     */
    static getClientsByTenent(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return "SELECT * FROM clients WHERE tenent_id = :tenentId" + pagination;
    }

    /**
     * @summary
     * {limit?:number , offset?:number}
     */
    static getIpWhiteList(ignorePagination:boolean):string{
        const pagination:string = ignorePagination ? "" : "LIMIT :limit OFFSET :offset";
        return "SELECT ip FROM ips WHERE tenent_id = :id" + pagination;
    }

    public getSubjectQG():SubjectQG{
        return new SubjectQG(this.tenentId,this.extraSubjectInsertionFields,this.extraSubjectFields);
    }

    public getSessionQG():SessionQG{
        return new SessionQG(this.tenentId, this.extraSessionInsertionFields,this.extraSessionFields);
    }

    public getLoginsQG():LoginsQG{
        return new LoginsQG(this.tenentId, this.extraLoginInsertionFields, this.extraLoginFields)
    }
}