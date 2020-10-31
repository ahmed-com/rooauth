// enums
import StorageEngine from "../StorageEngineEnum";

// interfaces
import Field from "../Field";
import FieldCollection from '../FieldCollection';
import SelectionCollection from "../SelectionCollection";
import UpdateCollection from "../UpdateCollection";
import DeleteCollection from "../DeletionCollection";
import {pagination , insertString, defienetionString, constructSelect, constructUpdate} from '../utils';

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
import constructDelete from "../utils/constructDelete";
import IQuery from "../IQuery";


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
            name : 'tenentId',
            insertionValue: 'DEFAULT',
            definetion : 'tenentId INTEGER UNSIGNED NOT NULL UNIQUE auto_increment',
            updateValue : ':tenentId'
        },

        subjectSchema : {
            name : 'subjectSchema',
            definetion : 'subjectSchema JSON NULL',
            insertionValue : ':subjectSchema',
            updateValue : ':subjectSchema'
        },

        mfaDefault : {
            name : 'mfaDefault',
            definetion : `mfaDefault BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultMfaDefault}`,
            default : `${TenentQG.defaultMfaDefault}`,
            insertionValue : `IFNULL(:mfaDefault,${TenentQG.defaultMfaDefault})`,
            updateValue : `:mfaDefault`            
        },

        mfaMethod : {
            name : 'mfaMethod',
            definetion : `mfaMethod VARCHAR (64) NOT NULL DEFAULT ${TenentQG.defaultMfaMethod}`,
            default : TenentQG.defaultMfaMethod,
            insertionValue : `IFNULL(:mfaMethod,${TenentQG.defaultMfaMethod})`,
            updateValue : ':mfaMethod'
        },

        privateKeyCipher : {
            name : 'privateKeyCipher',
            definetion : `privateKeyCipher VARCHAR(${TenentQG.privateKeyLength})`,
            insertionValue : ':privateKeyCipher',
            updateValue : ':privateKeyCipher'
        },

        publicKey : {
            name : 'publicKey',
            definetion : `publicKey VARCHAR(${TenentQG.publicKeyLength})`,
            insertionValue : ':publicKey',
            updateValue : ':publicKey'
        },

        hasIpWhiteList : {
            name : 'hasIpWhiteList',
            definetion : `hasIpWhiteList BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultIpWhiteListing}`,
            default : `${TenentQG.defaultIpWhiteListing}`,
            insertionValue : `IFNULL(:hasIpWhiteList,${TenentQG.defaultIpWhiteListing})`,
            updateValue : ':hasIpWhiteList'
        },

        storeLogins : {
            name : 'storeLogins',
            definetion : `storeLogins BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreLogins}`,
            default : `${TenentQG.defaultStoreLogins}`,
            insertionValue : `IFNULL(:storeLogins,${TenentQG.defaultStoreLogins})`,
            updateValue : ':storeLogins'
        },

        storeLoginTime : {
            name : 'storeLoginTime',
            definetion : `storeLoginTime BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreLoginTime}`,
            default : `${TenentQG.defaultStoreLoginTime}`,
            insertionValue : `IFNULL(:storeLoginTime,${TenentQG.defaultStoreLoginTime})`,
            updateValue : ':storeLoginTime'
        },

        storeLoginDeviceInfo : {
            name : 'storeLoginDeviceInfo',
            definetion : `storeLoginDeviceInfo BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreLoginDeviceInfo}`,
            default : `${TenentQG.defaultStoreLoginDeviceInfo}`,
            insertionValue : `IFNULL(:storeLoginDeviceInfo,${TenentQG.defaultStoreLoginDeviceInfo})`,
            updateValue : ':storeLoginDeviceInfo'
        },

        storeSubjectCreatedAt : {
            name : 'storeSubjectCreatedAt',
            definetion : `storeSubjectCreatedAt BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreCreatedAt}`,
            default : `${TenentQG.defaultStoreCreatedAt}`,
            insertionValue : `IFNULL(:storeSubjectCreatedAt,${TenentQG.defaultStoreCreatedAt})`,
            updateValue : ':storeSubjectCreatedAt'
        },

        storeSubjectUpdatedAt : {
            name : 'storeSubjectUpdatedAt',
            definetion : `storeSubjectUpdatedAt BOOLEAN NOT NULL DEFAULT ${TenentQG.defaultStoreUpdatedAt}`,
            default : `${TenentQG.defaultStoreUpdatedAt}`,
            insertionValue : `IFNULL(:storeSubjectUpdateddAt,${TenentQG.defaultStoreUpdatedAt})`,
            updateValue : ':storeSubjectUpdatedAt'
        },

        maxSession : {
            name : 'maxSession',
            definetion : `maxSession INTEGER NOT NULL DEFAULT ${TenentQG.defaultMaxSession}`,
            insertionValue : `IFNULL(:maxSession,${TenentQG.defaultMaxSession})`,
            default : `${TenentQG.defaultMaxSession}`,
            updateValue : ':maxSession'
        },

        ipRateLimit : {
            name : 'ipRateLimit',
            default : `${TenentQG.defaultIpRateLimit}`,
            definetion : `ipRateLimit INTEGER NOT NULL DEFAULT ${TenentQG.defaultIpRateLimit}`,
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

        all : (ignorePagination:boolean,...fields:Field[]):IQuery=>{
            const condition:string = '';
            const tableName:string = `tenents`;
            const queryStr:string = constructSelect(fields,tableName,condition,pagination(ignorePagination));
            return {queryStr , queryData : {}};
        },

        byTenentId : (_:boolean,tenentId:number,...fields:Field[]):IQuery=>{
            const condition:string = 'tenentId = :tenentId';
            const tableName:string = `tenents`;
            const queryStr:string = constructSelect(fields,tableName,condition," LIMIT 1 ");
            return {queryStr , queryData :{tenentId}};
        },

    }

    static update:UpdateCollection = {

        all : (...fields:Field[]):IQuery => {
            const condition:string = '';
            const tableName:string = `tenents`;
            const queryStr:string = constructUpdate(fields,tableName,condition);
            return {queryStr , queryData : {}};
        },

        byTenentId : (tenentId:number,...fields:Field[]):IQuery => {
            const condition:string = 'tenentId = :tenentId';
            const tableName:string = `tenents`;
            const queryStr:string = constructUpdate(fields,tableName,condition);
            return {queryStr , queryData : {tenentId}};
        },

    }

    static delete:DeleteCollection = {

        all : ():IQuery => {
            const condition:string = '';
            const tableName:string = 'tenents';
            const queryStr:string = constructDelete(tableName,condition);
            return {queryStr , queryData : {}};
        },

        byTenentId : (tenentId:number):IQuery => {
            const condition:string = 'tenentId = :tenentId';
            const tableName:string = 'tenents';
            const queryStr:string = constructDelete(tableName,condition);
            return {queryStr , queryData : {tenentId}};
        },

    }

    // ===========================================

    constructor(
        private tenentId:number
    ){}

    get id():number{
        return this.tenentId;
    }

    static createTable(engine:StorageEngine):IQuery{
        const fieldsString:string = defienetionString(TenentQG.fields);
        const queryStr:string = `CREATE TABLE IF NOT EXISTS tenents (
            ${fieldsString},
            PRIMARY KEY (tenentId)
        )ENGINE=${engine};`;

        return {queryStr , queryData : {}};
    }

    static insertTenent(data:object):IQuery{
        const queryStr:string = insertString (TenentQG.fields,`tenents`);

        return {queryStr , queryData : data};
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

    public getLoginsQG(tenentStore:ITenentStore):LoginsQG | null{
        let loginQG:LoginsQG = new LoginsQG(this.tenentId);

        if(tenentStore.storeForLogins === false) return null;

        if(tenentStore.storeForLogins.loggedAt) loginQG = new loginTimeDecorator(loginQG);
        if(tenentStore.storeForLogins.deviceInfo)loginQG = new loginDeviceInfoDecorator(loginQG);

        return loginQG;
    }

    public doExist():IQuery{
        const tenentId:number = this.id;
        const queryStr:string = `SELECT EXISTS( SELECT tenentId FROM tenents WHERE tenentId = :tenentId LIMIT 1 ) AS exists;`

        return {queryStr , queryData : {tenentId}};
    }
}