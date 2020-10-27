import TenentQG from '../../query_genrators/TenentQG/TenentQG';
import SubjectSchema from './Schema';
import MfaMethod from './MfaMethodEnum';
import Ip from '../Ip/Ip';
import ITenentStore from './ITenentStore';
import Client from '../Client/Client';
import pool from "../../services/db/db";
import TenentDBRow from './TenentDBRow';

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

    public get schema():Promise<SubjectSchema>{
        if(this._schema !== undefined){
            return Promise.resolve(this._schema);
        }

        const tenent:Tenent = this;

        const query:string = TenentQG.select.byTenentId(true,...Object.values(TenentQG.readableFields));

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

            return row.subject_schema!
        });
    }

}