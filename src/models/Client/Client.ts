import ClientQG from "../../query_genrators/ClientQG/ClientQG";
import Field from '../../query_genrators/Field';
import IQuery from '../../query_genrators/IQuery';

import pool from "../../services/db/db";
import {multipleExecute, myExecute} from '../../services/db/types';
import ClientDBRow from "./interfaces/ClientDBRow";
import ClientUpdateDataObj from "./interfaces/ClientUpdateDataObj";
import ClientUpdatedFieldObj from "./interfaces/ClientUpdateFieldObj";

type UpdateData = {fields:ClientUpdatedFieldObj,dataObj:ClientUpdateDataObj}

export default class Client{
    
    public static queryGenerator = ClientQG;
    private static manyExecute:multipleExecute = pool.manyExecute;
    public static execute:myExecute = pool.execute;

    public clientId:number;

    private _clientSecretHash?:string;
    private _details?:string | null;
    private _tenentId?:number;

    public execute:myExecute;
    private manyExecute:multipleExecute;

    private changes:UpdateData;

    constructor (clientId:number){
        this.clientId = clientId;

        this.execute = pool.execute;
        this.manyExecute = pool.manyExecute;
        this.changes = {
            fields : {},
            dataObj : {}
        }
    }

    public async saveChanges():Promise<void>{
        const clientId:number = this.clientId;

        const clientExists:boolean = await this.doExist();
        if(!clientExists) throw new Error("Client Doesn't Exist");

        const changedFields:Field[] = Object.values(this.changes.fields);
        const queryData:ClientUpdateDataObj = this.changes.dataObj;

        const query:IQuery = Client.queryGenerator.update.byClientId({
            clientId,
            ...queryData
        },...changedFields);

        return this.execute(query)
        .then(()=>{
            this.changes.dataObj = {};
            this.changes.fields = {};
        });
    }

    public async doExist():Promise<boolean>{
        const clientId:number = this.clientId
        const cQG:ClientQG = new Client.queryGenerator();

        const query:IQuery = cQG.doExist({clientId});

        return this.execute(query)
        .then(result => result[0])
        .then(row=>{
            return row.bool === 1 ? true : false;
        });
    }

    private fill(row:ClientDBRow):void{
        this._clientSecretHash = row.clientSecretHash;
        this._details = row.details;
        this._tenentId = row.tenentId;
    }

    private async populateFromDB():Promise<void>{
        const client:Client = this;
        const clientId:number = this.clientId;
        const allReadableFields:Field[] = Object.values(Client.queryGenerator.readableFields);

        const query:IQuery = Client.queryGenerator.select.byClientId({
            clientId,
            limit : 1
        },...allReadableFields);

        return this.execute(query)
        .then(function captureFirstResult(result:ClientDBRow[]) {
            if(result[0] !== undefined){
                return result[0];
            }else{
                throw new Error("Row Doesn't Exist");
            }
        })
        .then(function storeTheRow(row:ClientDBRow) {
            client.fill(row);
        });
    }

    public async getClientSecretHash():Promise<string>{
        if(this._clientSecretHash !== undefined){
            return Promise.resolve(this._clientSecretHash);
        }else{
            await this.populateFromDB();
            return this._clientSecretHash!;
        }
    }

    public set clientSecretHash(clientSecretHash:string){ 
        this._clientSecretHash = clientSecretHash;
        this.changes.fields.clientSecretHash = Client.queryGenerator.writableFields.clientSecretHash;
        this.changes.dataObj.clientSecretHash = clientSecretHash;
    }

    public async getDetails():Promise<string | null>{
        if(this._details !== undefined){
            return Promise.resolve(this._details);
        }else{
            await this.populateFromDB();
            return this._details!;
        }
    }

    public set details(details:string){
        this._details = details;
        this.changes.fields.details = Client.queryGenerator.writableFields.details;
        this.changes.dataObj.details = details
    }

    public async getTenentId():Promise<number>{
        if(this._tenentId !== undefined){
            return Promise.resolve(this._tenentId);
        }else{
            await this.populateFromDB();
            return this._tenentId!;
        }
    }

    public static async insertClient(clientId:number,clientSecretHash:string,details:string | null,tenentId:number):Promise<Client>{
        const query:IQuery = Client.queryGenerator.insertClient({
            clientId,
            clientSecretHash,
            details,
            tenentId
        });

        const {insertId} = await Client.execute(query)

        return new Client(insertId);
    }

    public static async searchClientsByTenentId(tenentId:number,limit:number,offset:number):Promise<Client[]>{
        const clientIdField:Field = Client.queryGenerator.readableFields.clientId
        const query:IQuery = Client.queryGenerator.select.byTenentId({
            tenentId,
            limit,
            offset
        },clientIdField);

        const result:ClientDBRow[] = await Client.execute(query);
        const clients:Client[] = result.map(row=> new Client(row.clientId));
        return clients;
    }
}