import TenentQG from '../../query_genrators/TenentQG/TenentQG';
import SubjectSchema from './Schema';
import MfaMethod from './MfaMethodEnum';
import ITenentStore from './ITenentStore';
import pool from "../../services/db/db";
import TenentDBRow from './TenentDBRow';
import Field from '../../query_genrators/Field';
import { encryptText , decryptCipher, generateKeys } from '../../cryptographer';
import ITenentStoreInput from './ITenentStoreInput';
import {multipleExecute, myExecute} from '../../services/db/types';
import SubjectQG from '../../query_genrators/SubjectQG/SubjectQG';
import TokenQG from '../../query_genrators/TokenQG/TokenQG';
import LoginQG from '../../query_genrators/LoginQG/LoginQG';
import StorageEngine from '../../query_genrators/StorageEngineEnum';
import ITenentUpdateDataObj from './ITenentUpdateDataObj';
import ITenentFieldObj from './ITenentUpdateFieldObj';

export default class Tenent{

    private static queryGenerator = TenentQG;
    private static manyExecute:multipleExecute = pool.manyExecute;
    public static execute:myExecute = pool.execute;

    public id:number;

    private _schema?:SubjectSchema | null;
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

    private changes:{fields:ITenentFieldObj, dataObj:ITenentUpdateDataObj};

    constructor(id:number){
        this.id = id;

        this.execute = pool.execute;
        this.manyExecute = pool.manyExecute;
        this.changes = {
            fields : {},
            dataObj : {}
        }
    };

    private async saveChanges():Promise<void>{
        const tenentExist:boolean = await this.doExist();
        if(!tenentExist) throw new Error("Tenent Doesn't exist");

        const changedFields:Field[] = Object.values(this.changes.fields);
        const query:string = Tenent.queryGenerator.update.byTenentId(...changedFields);

        const data:ITenentUpdateDataObj = this.changes.dataObj;
        return this.execute(query,data)
        .then(()=>{
            this.changes.dataObj = {};
            this.changes.fields = {};
        });
    }

    private async doExist():Promise<boolean>{
        const query:string = Tenent.queryGenerator.doExist();

        return this.execute(query,{
            tenentId: this.id
        })
        .then(result=>result[0])
        .then(row=>{
            return row.bool === 1 ? true : false;
        });
    }

    private fill(
        row:TenentDBRow
    ){
        this._schema = row.subject_schema;
        this._mfaDefault = row.mfa_enable_default;
        this._privateKeyCipher = row.private_key_cipher;
        this._publicKey = row.public_key;
        this._hasIpWhiteList = row.allow_ip_white_listing;
        this._maxSession = row.max_session;
        this._ipRateLimit = row.ip_rate_limit;
        if(row.mfa_method === MfaMethod.email) this._mfaMethod = MfaMethod.email;

        if(
            row.store_logins            !== undefined &&
            row.store_created_at        !== undefined &&
            row.store_updated_at        !== undefined &&
            row.store_login_time        !== undefined &&
            row.store_login_device_info !== undefined &&
            row.subject_schema          !== undefined
        ){
            let storeForLogins:any = false;
            if(row.store_logins === true) storeForLogins = {
                deviceInfo : row.store_login_device_info,
                loggedAt : row.store_login_time
            }

            this._tenentStore = {
                storeForSubject : {
                    createdAt : row.store_created_at,
                    updatedAt : row.store_updated_at,
                    data : row.subject_schema === null ? false : true
                },
                storeForLogins,
                storeForTokens:{
                    verified : true
                }
            }; 
        }
    }

    private async populateFromDB():Promise<void>{
        const tenent:Tenent = this;
        const allReadableFields:Field[] = Object.values(Tenent.queryGenerator.readableFields);
        const query:string = Tenent.queryGenerator.select.byTenentId(true,...allReadableFields);

        return this.execute(query,{
            tenentId : this.id
        })
        .then(function captureTheFirstResult(result:TenentDBRow[]):TenentDBRow{
            if(result[0] !== undefined){
                return result[0];
            }else{
                throw new Error("Row Doesn't Exist");
            }
        })
        .then(function storeTheRowAndReturnTheVariable(row:TenentDBRow){
            tenent.fill(row);
        });
    }
    
    public get schema():Promise<SubjectSchema | null>{
        if(this._schema !== undefined){
            return Promise.resolve(this._schema);
        }else{
            return this.populateFromDB()
            .then(()=>{
                return this._schema!
            });
        }
    }

    public set schema(schema:Promise<SubjectSchema | null>){
        schema
        .then(schema=>{
            this._schema = schema;
            this.changes.fields.subjectSchema = Tenent.queryGenerator.writableFields.subjectSchema;
            this.changes.dataObj.subjectSchema = schema;
        });
    }

    public get mfaDefault():Promise<boolean>{
        if(this._mfaDefault !== undefined){
            return Promise.resolve(this._mfaDefault);
        }else{
            return this.populateFromDB()
            .then(()=>{
                return this._mfaDefault!
            })
        }
    }

    public set mfaDefault(mfaDefault:Promise<boolean>){
        mfaDefault
        .then(mfaDefault=>{
            this._mfaDefault = mfaDefault
            this.changes.fields.mfaEnableDefault = Tenent.queryGenerator.writableFields.mfaEnableDefault;
            this.changes.dataObj.mfaEnableDefault = mfaDefault;
        });
    }

    public get mfaMethod():Promise<MfaMethod>{
        if(this._mfaMethod !== undefined){
            return Promise.resolve(this._mfaMethod);
        }else{
            return this.populateFromDB()
            .then(()=>{
                return this._mfaMethod!
            })
        }
    }

    public set mfaMethod(mfaMethod:Promise<MfaMethod>){
        mfaMethod
        .then(mfaMethod=>{
            this._mfaMethod = mfaMethod;
            this.changes.fields.mfaMethod = Tenent.queryGenerator.writableFields.mfaMethod;
            this.changes.dataObj.mfaMethod = mfaMethod;
        })
    }
    
    public get publicKey():Promise<string>{
        if(this._publicKey !== undefined){
            return Promise.resolve(this._publicKey);
        }else{
            return this.populateFromDB()
            .then(()=>{
                return this._publicKey!
            });
        }
    }

    public set publicKey(publicKey:Promise<string>){
        publicKey
        .then(publicKey=>{
            this._publicKey = publicKey;
            this.changes.fields.publicKey = Tenent.queryGenerator.writableFields.publicKey;
            this.changes.dataObj.publicKey = publicKey;
        });
    }
    
    public get hasIpWhiteList():Promise<boolean>{
        if(this._hasIpWhiteList !== undefined){
            return Promise.resolve(this._hasIpWhiteList);
        }else{
            return this.populateFromDB()
            .then(()=>{
                return this._hasIpWhiteList!
            });
        }
    }

    public set hasIpWhiteList(has:Promise<boolean>){
        has
        .then(has=>{
            this._hasIpWhiteList = has;
            this.changes.fields.allowIpWhiteListing = Tenent.queryGenerator.writableFields.allowIpWhieListing;
            this.changes.dataObj.allowIpWhiteListing = has;
        });
    }
    
    public get maxSession():Promise<number>{
        if(this._maxSession !== undefined){
            return Promise.resolve(this._maxSession);
        }else{
            return this.populateFromDB()
            .then(()=>{
                return this._maxSession!
            });
        }
    }

    public set maxSession(ms:Promise<number>){
        ms
        .then(ms=>{
            this._maxSession = ms;
            this.changes.fields.maxSession = Tenent.queryGenerator.fields.maxSession;
            this.changes.dataObj.maxSession = ms;
        });
    }
    
    public get ipRateLimit():Promise<number>{
        if(this._ipRateLimit !== undefined){
            return Promise.resolve(this._ipRateLimit);
        }else{
            return this.populateFromDB()
            .then(()=>{
                return this._ipRateLimit!
            });
        }
    }

    public set ipRateLimit(irl:Promise<number>){
        irl
        .then(irl=>{
            this._ipRateLimit = irl;
            this.changes.fields.ipRateLimit = Tenent.queryGenerator.writableFields.ipRateLimit;
            this.changes.dataObj.ipRateLimit = irl;
        })
    }
    
    public get tenentStore():Promise<ITenentStore>{
        if(this._tenentStore !== undefined){
            return Promise.resolve(this._tenentStore);
        }else{
            return this.populateFromDB()
            .then(()=>{
                return this._tenentStore!
            });
        }
    }

    private get privateKeyCipher():Promise<string>{
        if(this._privateKeyCipher !== undefined){
            return Promise.resolve(this._privateKeyCipher);
        }else{
            return this.populateFromDB()
            .then(()=>{
                return this._privateKeyCipher!
            });
        }
    }

    public get privateKey():Promise<string>{
        if(this._privateKey !== undefined){
            return Promise.resolve(this._privateKey);
        }else{
            return this.privateKeyCipher
                .then(decryptCipher)
                .then(privateKey=>{
                    this._privateKey = privateKey
                    return privateKey;
                });
        }
    }

    private static async InsertTenent(
        mfaMethod:MfaMethod | null,
        mfaDefault:boolean | null,
        privateKeyCipher:string,
        publicKey:string,
        hasIpWhiteList:boolean | null,
        tenentStore:ITenentStore | ITenentStoreInput,
        maxSession:number | null,
        ipRateLimit:number | null,
        schema:SubjectSchema | null,
        execute:myExecute
    ):Promise<number>{
        const query:string = Tenent.queryGenerator.insertTenent();

        const subjectSchema:string = JSON.stringify(schema);
        const allowIpWhieListing:boolean | null = hasIpWhiteList;
        const mfaEnableDefault:boolean | null = mfaDefault;
        const storeCreatedAt:boolean | null = tenentStore.storeForSubject.createdAt;
        const storeUpdatedAt:boolean | null = tenentStore.storeForSubject.updatedAt;

        let storeLogins:boolean | null;
        let storeLoginTime:boolean | null;
        let storeLoginDeviceInfo:boolean | null;

        if(tenentStore.storeForLogins === false){
            storeLogins = false;
            storeLoginTime = false;
            storeLoginDeviceInfo = false;
        }else if(tenentStore.storeForLogins === null){
            storeLogins = null;
            storeLoginTime = null;
            storeLoginDeviceInfo = null;
        }else{
            storeLogins = true;
            storeLoginTime = tenentStore.storeForLogins.loggedAt;
            storeLoginDeviceInfo = tenentStore.storeForLogins.deviceInfo;
        }
        
        return execute(query,{
            subjectSchema,
            mfaEnableDefault,
            mfaMethod : mfaMethod === null ? mfaMethod : MfaMethod[mfaMethod],
            privateKeyCipher,
            publicKey,
            allowIpWhieListing,
            storeLogins,
            storeLoginDeviceInfo,
            storeLoginTime,
            storeCreatedAt,
            storeUpdatedAt,
            maxSession,
            ipRateLimit
        })
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

        return Tenent.manyExecute(async function insertTenentInDB(execute:myExecute) {
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
            const _tenentStore:ITenentStore = await tenent.tenentStore;

            const tenentQG:TenentQG = new Tenent.queryGenerator(insertId);
            const subjectQG:SubjectQG = tenentQG.getSubjectQG(_tenentStore);
            const tokenQG:TokenQG = tenentQG.getTokenQG(_tenentStore);
            const loginQG:LoginQG | null = tenentQG.getLoginsQG(_tenentStore);

            const createSubjectTableQuery:string = subjectQG.createTable(StorageEngine.InnoDB);
            const createTokenTableQuery:string = tokenQG.createTable(StorageEngine.InnoDB);
            let createLoginTableQuery:string = '';
            if(loginQG !== null) createLoginTableQuery = loginQG.createTable(StorageEngine.InnoDB);

            await execute(createSubjectTableQuery,{});
            await execute(createTokenTableQuery,{});
            if(loginQG !== null) await execute(createLoginTableQuery,{});

            tenent.execute = defaultExecute;
        })
        .then(()=>tenent);
    }
}