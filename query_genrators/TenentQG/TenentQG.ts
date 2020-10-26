// enums
import StorageEngine from "../StorageEngineEnum";

// interfaces
import Field from "../Field";
import FieldCollection from '../FieldCollection';
import SelectionCollection from "../SelectionCollection";
import {pagination , insertString, defienetionString, constructSelect} from '../utils';

// JSON
import config from "../../config/config.json";

// classes
import SubjectQG from '../SubjectQG/SubjectQG';
import TokenQG from '../TokenQG/TokenQG';
import LoginsQG from '../LoginQG/LoginQG';


export default class TenentQG {

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
    static defaultMfaMethod:string = config.defaults.mfaMethod;
    static defaultMfaDefault:boolean = config.defaults.mfaDefault;
    static defaultIpWhiteListing:boolean = config.defaults.ipWhiteListing;
    static defaultStoreCreatedAt:boolean = config.defaults.storeCreatedAt;
    static defaultStoreUpdatedAt:boolean = config.defaults.storeUpdatedAt;
    static defaultStoreLogins:string = JSON.stringify(config.defaults.storeLogins);

    /**
     * all the fields
     */
    static fields:FieldCollection = {

        tenentId : {
            name : 'tenent_id',
            insertionValue: 'DEFAULT',
            definetion : 'tenent_id INTEGER UNSIGNED NOT NULL UNIQUE auto_increment',
            updateValue : ':tenentId'
        },

        subjectSchema : {
            name : 'subject_schema',
            definetion : 'subject_schema JSON NULL',
            insertionValue : ':subjectSchema',
            updateValue : ':subjectSchema'
        },

        mfaEnableDefault : {
            name : 'mfa_enable_default',
            definetion : `mfa_enable_default BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultMfaDefault}`,
            default : `${TenentQG.defaultMfaDefault}`,
            insertionValue : `IFNULL(:mfaEnableDefault,${TenentQG.defaultMfaDefault})`,
            updateValue : `:mfaEnableDefault`            
        },

        mfaMethod : {
            name : 'mfa_method',
            definetion : `mfa_method VARCHAR (64) NOT NULL DEFAULT ${TenentQG.defaultMfaMethod}`,
            default : TenentQG.defaultMfaMethod,
            insertionValue : `IFNULL(:mfaMethod,${TenentQG.defaultMfaMethod})`,
            updateValue : ':mfaMethod'
        },

        privateKey : {
            name : 'private_key',
            definetion : `private_key VARCHAR(${TenentQG.privateKeyLength})`,
            insertionValue : ':privateKey',
            updateValue : ':privateKey'
        },

        publicKey : {
            name : 'public_key',
            definetion : `public_key VARCHAR(${TenentQG.publicKeyLength})`,
            insertionValue : ':publicKey',
            updateValue : ':publicKey'
        },

        allowIpWhiteListing : {
            name : 'allow_ip_white_listing',
            definetion : `allow_ip_white_listing BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultIpWhiteListing}`,
            default : `${TenentQG.defaultIpWhiteListing}`,
            insertionValue : `IFNULL(:allowIpWhiteListing,${TenentQG.defaultIpWhiteListing})`,
            updateValue : ':allowIpWhiteListing'
        },

        storeLogins : {
            name : 'store_logins',
            definetion : `store_logins JSON NOT NULL DEFAULT ${TenentQG.defaultStoreLogins}`,
            default : TenentQG.defaultStoreLogins,
            insertionValue : `IFNULL(:storeLogins,${TenentQG.defaultStoreLogins})`,
            updateValue : ':storeLogins'
        },

        storeCreatedAt : {
            name : 'store_created_at',
            definetion : `store_created_at BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreCreatedAt}`,
            default : `${TenentQG.defaultStoreCreatedAt}`,
            insertionValue : `IFNULL(:storeCreatedAt,${TenentQG.defaultStoreCreatedAt})`,
            updateValue : ':storeCreatedAt'
        },

        storeUpdatedAt : {
            name : 'store_created_at',
            definetion : `store_created_at BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreUpdatedAt}`,
            default : `${TenentQG.defaultStoreUpdatedAt}`,
            insertionValue : `IFNULL(:storeCreatedAt,${TenentQG.defaultStoreUpdatedAt})`,
            updateValue : ':storeCreatedAt'
        },

        maxSession : {
            name : 'max_session',
            definetion : `max_session INTEGER NOT NULL DEFAULT ${TenentQG.defaultMaxSession}`,
            insertionValue : `IFNULL(:maxSession,${TenentQG.defaultMaxSession})`,
            default : `${TenentQG.defaultMaxSession}`,
            updateValue : ':maxSession'
        },

        ipRateLimit : {
            name : 'ip_rate_limit',
            default : `${TenentQG.defaultIpRateLimit}`,
            definetion : `ip_rate_limit INTEGER NOT NULL DEFAULT ${TenentQG.defaultIpRateLimit}`,
            insertionValue : `IFNULL(:ipRateLimit,${TenentQG.defaultIpRateLimit})`,
            updateValue : ':ipRateLimit'
        }

    }

    /**
     * the readable fields
     */
    static readableFields:FieldCollection = {
        ...TenentQG.fields
    };

    /**
     * the writable fields
     */
    static writableFields:FieldCollection = {
        ...TenentQG.fields
    }

    static select:SelectionCollection = {

        all : (ignorePagination:boolean,...fields:Field[]):string=>{
            const condition:string = '';
            const tableName:string = `tenents`;
            return constructSelect(fields,tableName,condition,pagination(ignorePagination));
        },

        byTenentId : (ignorePagination:boolean,...fields:Field[]):string=>{
            const condition:string = 'tenent_id = :tenentId';
            const tableName:string = `tenents`;
            return constructSelect(fields,tableName,condition,pagination(ignorePagination));
        },

    }

    // ===========================================

    constructor(
        private tenentId:number
    ){}

    get id():number{
        return this.tenentId;
    }

    static createTable(engine:StorageEngine):string{
        const fieldsString:string = defienetionString(TenentQG.fields);

        return `CREATE TABLE IF NOT EXISTS tenents (
            ${fieldsString},
            PRIMARY KEY (tenent_id)
        )ENGINE=${engine};`;
    }

    static insertTenent():string{
        return insertString (TenentQG.fields,`tenents`);
    }

    public getSubjectQG():SubjectQG{
        return new SubjectQG(this.tenentId);
    }

    public getTokenQG():TokenQG{
        return new TokenQG(this.tenentId);
    }

    public getLoginsQG():LoginsQG{
        return new LoginsQG(this.tenentId);
    }
}