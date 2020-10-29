// enums
import StorageEngine from "../StorageEngineEnum";

// interfaces
import Field from "../Field";
import FieldCollection from '../FieldCollection';
import SelectionCollection from "../SelectionCollection";
import {pagination , insertString, defienetionString, constructSelect} from '../utils';

import subjectCreatedAtDecorator from '../SubjectQG/CreatedAt'
import subjectUpdatedAtDecorator from '../SubjectQG/UpdatedAt'
import subjectDataAtDecorator from '../SubjectQG/Data'

import tokenVerifiedDecorator from '../TokenQG/Verified';

import loginTimeDecorator from '../LoginQG/LoggedAt';
import loginDeviceInfoDecorator from '../LoginQG/DeviceInfo';

// JSON
import config from "../../config/config.json";

// classes
import SubjectQG from '../SubjectQG/SubjectQG';
import TokenQG from '../TokenQG/TokenQG';
import LoginsQG from '../LoginQG/LoginQG';
import ITenentStore from "../../models/Tenent/ITenentStore";


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
    static defaultStoreLogins:boolean = config.defaults.storeLogins;
    static defaultStoreLoginTime:boolean = config.defaults.storeLoginTime;
    static defaultStoreLoginDeviceInfo:boolean = config.defaults.storeLoginDeviceInfo;

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

        privateKeyCipher : {
            name : 'private_key_cipher',
            definetion : `private_key_cipher VARCHAR(${TenentQG.privateKeyLength})`,
            insertionValue : ':privateKeyCipher',
            updateValue : ':privateKeyCipher'
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
            definetion : `store_logins BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreLogins}`,
            default : `${TenentQG.defaultStoreLogins}`,
            insertionValue : `IFNULL(:storeLogins,${TenentQG.defaultStoreLogins})`,
            updateValue : ':storeLogins'
        },

        storeLoginTime : {
            name : 'store_login_time',
            definetion : `store_login_time BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreLoginTime}`,
            default : `${TenentQG.defaultStoreLoginTime}`,
            insertionValue : `IFNULL(:storeLoginTime,${TenentQG.defaultStoreLoginTime})`,
            updateValue : ':storeLoginTime'
        },

        storeLoginDeviceInfo : {
            name : 'store_login_device_info',
            definetion : `store_login_device_info BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreLoginDeviceInfo}`,
            default : `${TenentQG.defaultStoreLoginDeviceInfo}`,
            insertionValue : `IFNULL(:storeLoginDeviceInfo,${TenentQG.defaultStoreLoginDeviceInfo})`,
            updateValue : ':storeLoginDeviceInfo'
        },

        storeCreatedAt : {
            name : 'store_created_at',
            definetion : `store_created_at BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreCreatedAt}`,
            default : `${TenentQG.defaultStoreCreatedAt}`,
            insertionValue : `IFNULL(:storeCreatedAt,${TenentQG.defaultStoreCreatedAt})`,
            updateValue : ':storeCreatedAt'
        },

        storeUpdatedAt : {
            name : 'store_updated_at',
            definetion : `store_updated_at BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreUpdatedAt}`,
            default : `${TenentQG.defaultStoreUpdatedAt}`,
            insertionValue : `IFNULL(:storeUpdateddAt,${TenentQG.defaultStoreUpdatedAt})`,
            updateValue : ':storeUpdatedAt'
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

        byTenentId : (_:boolean,...fields:Field[]):string=>{
            const condition:string = 'tenent_id = :tenentId';
            const tableName:string = `tenents`;
            return constructSelect(fields,tableName,condition,"LIMIT 1;");
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

    public getSubjectQG(tenentStore:ITenentStore):SubjectQG{
        let subjectQG:SubjectQG = new SubjectQG(this.tenentId);

        if(tenentStore.storeForSubject.createdAt) subjectQG = new subjectCreatedAtDecorator(subjectQG);
        if(tenentStore.storeForSubject.updatedAt) subjectQG = new subjectUpdatedAtDecorator(subjectQG);
        if(tenentStore.storeForSubject.data) subjectQG = new subjectDataAtDecorator(subjectQG);

        return subjectQG;
    }

    public getTokenQG(tenentStore:ITenentStore):TokenQG{
        let tokenQG:TokenQG = new TokenQG(this.tenentId);

        if(tenentStore.storeForTokens.verified) tokenQG = new tokenVerifiedDecorator(tokenQG);

        return tokenQG;
    }

    public getLoginsQG(tenentStore:ITenentStore):LoginsQG{
        let loginQG:LoginsQG = new LoginsQG(this.tenentId);

        if(tenentStore.storeForLogins === false) throw new Error();

        if(tenentStore.storeForLogins.loggedAt) loginQG = new loginTimeDecorator(loginQG);
        if(tenentStore.storeForLogins.deviceInfo)loginQG = new loginDeviceInfoDecorator(loginQG);

        return loginQG;
    }

    public static doExist():string{
        return `SELECT EXISTS( SELECT tenent_id FROM tenents WHERE tenent_id = :tenentId LIMIT 1 ) AS exists;`
    }
}