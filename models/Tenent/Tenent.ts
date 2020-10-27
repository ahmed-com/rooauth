import TenentQG from '../../query_genrators/TenentQG/TenentQG';
import SubjectSchema from './Schema';
import MfaMethod from './MfaMethodEnum';
import Ip from '../Ip/Ip';
import ITenentStore from './ITenentStore';
import Client from '../Client/Client';
import pool from "../../services/db/db";
import TenentDBRow from './TenentDBRow';
import Field from '../../query_genrators/Field';
import { encryptText , decryptCipher } from '../../cryptographer';

export default class Tenent{

    private static queryGenerator = TenentQG;

    public id:number;

    private _schema?:SubjectSchema;
    private _mfaDefault?:boolean;
    private _mfaMethod?:MfaMethod;
    private _privateKeyCipher?:string;
    private _privateKey?:string;
    private _publicKey?:string;
    private _hasIpWhiteList?:boolean;
    private _ipWhiteList?:Ip[];
    private _tenentStore?:ITenentStore;
    private _maxSession?:number;
    private _ipRateLimit?:number;
    private _clientList?:Client[];

    constructor(id:number){
        this.id = id;
    };

    private async doExist():Promise<boolean>{
        const query:string = TenentQG.doExist();

        return pool.execute(query,{
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
        this._mfaMethod = row.mfa_method;
        this._privateKeyCipher = row.private_key_cipher;
        this._publicKey = row.public_key;
        this._hasIpWhiteList = row.allow_ip_white_listing;
        this._maxSession = row.max_session;
        this._ipRateLimit = row.ip_rate_limit;

        if(
            row.store_logins     !== undefined &&
            row.store_created_at !== undefined &&
            row.store_updated_at !== undefined
        ){
            this._tenentStore = {
                storeForSubject : {
                    createdAt : row.store_created_at,
                    updatedAt : row.store_updated_at
                },
                storeForeLogins : row.store_logins
            }; 
        }
    }

    private populateFromDB():Promise<void>{
        const tenent:Tenent = this;
        const allReadableFields:Field[] = Object.values(TenentQG.readableFields);
        const query:string = TenentQG.select.byTenentId(true,...allReadableFields);

        return pool.execute(query,{
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
    
    public get schema():Promise<SubjectSchema>{
        if(this._schema !== undefined){
            return Promise.resolve(this._schema);
        }else{
            return this.populateFromDB()
            .then(()=>{
                return this._schema!
            });
        }
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
}