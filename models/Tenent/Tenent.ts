import TenentQG from '../../query_genrators/TenentQG/TenentQG';
import SubjectQG from '../../query_genrators/SubjectQG/SubjectQG';
import TokenQG from '../../query_genrators/TokenQG/TokenQG';
import LoginQG from '../../query_genrators/LoginQG/LoginQG';
import Field from '../../query_genrators/Field';
import IQuery from '../../query_genrators/IQuery';
import StorageEngine from '../../query_genrators/StorageEngineEnum';

import SubjectSchema from './Schema';
import MfaMethod from './MfaMethodEnum';
import ITenentStore from './ITenentStore';
import TenentDBRow from './TenentDBRow';
import ITenentUpdateDataObj from './ITenentUpdateDataObj';
import ITenentUpdateFieldObj from './ITenentUpdateFieldObj';
import ITenentStoreInput from './ITenentStoreInput';

import { encryptText , decryptCipher, generateKeys } from '../../cryptographer';

import pool from "../../services/db/db";
import {multipleExecute, myExecute} from '../../services/db/types';

export default class Tenent{

    public static queryGenerator = TenentQG;
    private static manyExecute:multipleExecute = pool.manyExecute;
    public static execute:myExecute = pool.execute;

    public tenentId:number;

    private _subjectSchema?:SubjectSchema | null;
    private _mfaDefault?:boolean;
    private _mfaMethod?:MfaMethod;
    private _privateKeyCipher?:string;
    private _privateKey?:string;
    private _publicKey?:string;
    private _hasIpWhiteList?:boolean;
    private _tenentStore?:ITenentStore;
    private _maxSession?:number;
    private _ipRateLimit?:number;

    public execute:myExecute;
    private manyExecute:multipleExecute;

    private changes:{fields:ITenentUpdateFieldObj, dataObj:ITenentUpdateDataObj};

    constructor(tenentId:number){
        this.tenentId = tenentId;

        this.execute = pool.execute;
        this.manyExecute = pool.manyExecute;
        this.changes = {
            fields : {},
            dataObj : {}
        }
    };

    public async saveChanges():Promise<void>{
        const tenentId:number = this.tenentId;

        const tenentExist:boolean = await this.doExist();
        if(!tenentExist) throw new Error("Tenent Doesn't exist");

        const changedFields:Field[] = Object.values(this.changes.fields);
        const queryData:ITenentUpdateDataObj = this.changes.dataObj;

        const query:IQuery = Tenent.queryGenerator.update.byTenentId({
            tenentId,
            ...queryData
        },...changedFields);

        
        return this.execute(query)
        .then(()=>{
            this.changes.dataObj = {};
            this.changes.fields = {};
        });
    }

    public async doExist():Promise<boolean>{
        const tQG:TenentQG = new Tenent.queryGenerator(this.tenentId);
        const query:IQuery = tQG.doExist({tenentId : this.tenentId});

        return this.execute(query)
        .then(result=>result[0])
        .then(row=>{
            return row.bool === 1 ? true : false;
        });
    }

    private fill(row:TenentDBRow):void{
        
        this._mfaDefault = row.mfaDefault;
        this._privateKeyCipher = row.privateKeyCipher;
        this._publicKey = row.publicKey;
        this._hasIpWhiteList = row.hasIpWhiteList;
        this._maxSession = row.maxSession;
        this._ipRateLimit = row.ipRateLimit;

        if(row.mfaMethod === MfaMethod.email) this._mfaMethod = MfaMethod.email;

        if(
            row.storeLogins           !== undefined &&
            row.storeSubjectCreatedAt !== undefined &&
            row.storeSubjectUpdatedAt !== undefined &&
            row.storeLoginTime        !== undefined &&
            row.storeLoginDeviceInfo  !== undefined &&
            row.subjectSchema         !== undefined
        ){
            let storeForLogins:any = false;
            if(row.storeLogins === true) storeForLogins = {
                deviceInfo : row.storeLoginDeviceInfo,
                loggedAt : row.storeLoginTime
            }

            this._tenentStore = {
                storeForSubject : {
                    createdAt : row.storeSubjectCreatedAt,
                    updatedAt : row.storeSubjectUpdatedAt,
                    data : row.subjectSchema === null ? false : true
                },
                storeForLogins,
                storeForTokens:{
                    verified : true
                }
            }; 
        }

        if(row.subjectSchema !== undefined && row.subjectSchema !== null) this._subjectSchema = JSON.parse(row.subjectSchema);
        if(row.subjectSchema !== undefined && row.subjectSchema === null) this._subjectSchema = null;
    }

    private async populateFromDB():Promise<void>{
        const tenent:Tenent = this;
        const tenentId:number = this.tenentId;
        const allReadableFields:Field[] = Object.values(Tenent.queryGenerator.readableFields);

        const query:IQuery = Tenent.queryGenerator.select.byTenentId({
            tenentId,
            limit: 1
        },...allReadableFields);

        return this.execute(query)
        .then(function captureTheFirstResult(result:TenentDBRow[]):TenentDBRow{
            if(result[0] !== undefined){
                return result[0];
            }else{
                throw new Error("Row Doesn't Exist");
            }
        })
        .then(function storeTheRow(row:TenentDBRow){
            tenent.fill(row);
        });
    }
    
    public async getSubjectSchema():Promise<SubjectSchema | null>{
        if(this._subjectSchema !== undefined){
            return Promise.resolve(this._subjectSchema);
        }else{
            await this.populateFromDB()
            return this._subjectSchema!;
        }
    }

    public set subjectSchema(schema:SubjectSchema | null){
        this._subjectSchema = schema;
        this.changes.fields.subjectSchema = Tenent.queryGenerator.writableFields.subjectSchema;
        this.changes.dataObj.subjectSchema = JSON.stringify(schema);
    }

    public async getMfaDefault():Promise<boolean>{
        if(this._mfaDefault !== undefined){
            return Promise.resolve(this._mfaDefault);
        }else{
            await this.populateFromDB()
            return this._mfaDefault!;
        }
    }

    public set mfaDefault(mfaDefault:boolean){
        this._mfaDefault = mfaDefault
        this.changes.fields.mfaDefault = Tenent.queryGenerator.writableFields.mfaDefault;
        this.changes.dataObj.mfaDefault = mfaDefault;
    }

    public async getMfaMethod():Promise<MfaMethod>{
        if(this._mfaMethod !== undefined){
            return Promise.resolve(this._mfaMethod);
        }else{
            await this.populateFromDB()
            return this._mfaMethod!;
        }
    }

    public set mfaMethod(mfaMethod:MfaMethod){
        this._mfaMethod = mfaMethod;
        this.changes.fields.mfaMethod = Tenent.queryGenerator.writableFields.mfaMethod;
            
        if(mfaMethod === MfaMethod.email) this.changes.dataObj.mfaMethod = "email";
    }
    
    public async getPublicKey():Promise<string>{
        if(this._publicKey !== undefined){
            return Promise.resolve(this._publicKey);
        }else{
            await this.populateFromDB()
            return this._publicKey!;
        }
    }

    public set publicKey(publicKey:string){
        this._publicKey = publicKey;
        this.changes.fields.publicKey = Tenent.queryGenerator.writableFields.publicKey;
        this.changes.dataObj.publicKey = publicKey;
    }
    
    public async getHasIpWhiteList():Promise<boolean>{
        if(this._hasIpWhiteList !== undefined){
            return Promise.resolve(this._hasIpWhiteList);
        }else{
            await this.populateFromDB()
            return this._hasIpWhiteList!;
        }
    }

    public set hasIpWhiteList(has:boolean){
        this._hasIpWhiteList = has;
        this.changes.fields.hasIpWhiteList = Tenent.queryGenerator.writableFields.hasIpWhiteList;
        this.changes.dataObj.hasIpWhiteList = has;
    }
    
    public async getMaxSession():Promise<number>{
        if(this._maxSession !== undefined){
            return Promise.resolve(this._maxSession);
        }else{
            await this.populateFromDB()
            return this._maxSession!;
        }
    }

    public set maxSession(ms:number){
        this._maxSession = ms;
        this.changes.fields.maxSession = Tenent.queryGenerator.fields.maxSession;
        this.changes.dataObj.maxSession = ms;
    }
    
    public async getIpRateLimit():Promise<number>{
        if(this._ipRateLimit !== undefined){
            return Promise.resolve(this._ipRateLimit);
        }else{
            await this.populateFromDB()
            return this._ipRateLimit!;
        }
    }

    public set ipRateLimit(irl:number){
        this._ipRateLimit = irl;
        this.changes.fields.ipRateLimit = Tenent.queryGenerator.writableFields.ipRateLimit;
        this.changes.dataObj.ipRateLimit = irl;
    }
    
    public async getTenentStore():Promise<ITenentStore>{
        if(this._tenentStore !== undefined){
            return Promise.resolve(this._tenentStore);
        }else{
            await this.populateFromDB()
            return this._tenentStore!;
        }
    }

    // Notice that there is no setter function beacuse you can never update the tenent data store after initialization

    private async getPrivateKeyCipher():Promise<string>{
        if(this._privateKeyCipher !== undefined){
            return Promise.resolve(this._privateKeyCipher);
        }else{
            await this.populateFromDB()
            return this._privateKeyCipher!;
        }
    }

    public async getPrivateKey():Promise<string>{
        if(this._privateKey !== undefined){
            return Promise.resolve(this._privateKey);
        }else{
            const privateKeyEncrypted:string = await this.getPrivateKeyCipher();
            const privateKey:string = await decryptCipher(privateKeyEncrypted);
            this._privateKey = privateKey
            return privateKey;
        }
    }

    private static async InsertTenent(
        _mfaMethod:MfaMethod | null,
        _mfaDefault:boolean | null,
        _privateKeyCipher:string,
        _publicKey:string,
        _hasIpWhiteList:boolean | null,
        _tenentStore:ITenentStore | ITenentStoreInput,
        _maxSession:number | null,
        _ipRateLimit:number | null,
        _subjectSchema:SubjectSchema | null,
        execute:myExecute
    ):Promise<number>{
        const subjectSchema:string = JSON.stringify(_subjectSchema);

        const mfaMethod:string | null = _mfaMethod === null ? _mfaMethod : MfaMethod[_mfaMethod]

        const hasIpWhiteList:boolean | null = _hasIpWhiteList;
        const mfaDefault:boolean | null = _mfaDefault;
        const storeSubjectCreatedAt:boolean | null = _tenentStore.storeForSubject.createdAt;
        const storeSubjectUpdatedAt:boolean | null = _tenentStore.storeForSubject.updatedAt;

        let storeLogins:boolean | null;
        let storeLoginTime:boolean | null;
        let storeLoginDeviceInfo:boolean | null;

        if(_tenentStore.storeForLogins === false){
            storeLogins = false;
            storeLoginTime = false;
            storeLoginDeviceInfo = false;
        }else if(_tenentStore.storeForLogins === null){
            storeLogins = null;
            storeLoginTime = null;
            storeLoginDeviceInfo = null;
        }else{
            storeLogins = true;
            storeLoginTime = _tenentStore.storeForLogins.loggedAt;
            storeLoginDeviceInfo = _tenentStore.storeForLogins.deviceInfo;
        }

        const query:IQuery = Tenent.queryGenerator.insertTenent({
            subjectSchema,
            mfaDefault,
            mfaMethod,
            hasIpWhiteList,
            privateKeyCipher : _privateKeyCipher,
            publicKey : _publicKey,
            storeLogins,
            storeLoginDeviceInfo,
            storeLoginTime,
            storeSubjectCreatedAt,
            storeSubjectUpdatedAt,
            maxSession : _maxSession,
            ipRateLimit: _ipRateLimit
        });
        
        return execute(query)
        .then(({insertId})=>insertId);
    }

    public static async createTenent(
        mfaMethod:MfaMethod | null,
        mfaDefault:boolean | null,
        hasIpWhiteList:boolean | null,
        tenentStore:ITenentStore | ITenentStoreInput,
        maxSession:number | null,
        ipRateLimit:number | null,
        schema:SubjectSchema | null
    ):Promise<Tenent>{
        const {publicKey , privateKey} = await generateKeys(); 
        const privateKeyCipher:string = await encryptText(privateKey);

        let tenent:Tenent;

        return Tenent.manyExecute(async function insertTenentIntoDB(execute:myExecute) {

            const insertId:number = await Tenent.InsertTenent(
                mfaMethod,
                mfaDefault,
                privateKeyCipher,
                publicKey,
                hasIpWhiteList,
                tenentStore,
                maxSession,
                ipRateLimit,
                schema,
                execute
            );

            tenent = new Tenent(insertId);

            const defaultExecute:myExecute = tenent.execute;
            tenent.execute = execute;
            const _tenentStore:ITenentStore = await tenent.getTenentStore();
            tenent.execute = defaultExecute;

            const tenentQG:TenentQG = new Tenent.queryGenerator(insertId);
            const subjectQG:SubjectQG = tenentQG.getSubjectQG(_tenentStore);
            const tokenQG:TokenQG = tenentQG.getTokenQG(_tenentStore);
            const loginQG:LoginQG | null = tenentQG.getLoginsQG(_tenentStore);

            const createSubjectTableQuery:IQuery = subjectQG.createTable(StorageEngine.InnoDB);
            await execute(createSubjectTableQuery);

            const createTokenTableQuery:IQuery = tokenQG.createTable(StorageEngine.InnoDB);
            await execute(createTokenTableQuery);

            if(loginQG !== null){
                const createLoginTableQuery:IQuery = loginQG.createTable(StorageEngine.InnoDB);
                await execute(createLoginTableQuery);
            }

        })
        .then(()=>tenent);
    }
}