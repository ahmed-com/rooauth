import Tenent from "../Tenent/Tenent";
import ITenentStore from "../Tenent/ITenentStore";
import TenentQG from "../../query_genrators/TenentQG/TenentQG";
import SubjectQG from "../../query_genrators/SubjectQG/SubjectQG";
import pool from "../../services/db/db";
import {multipleExecute, myExecute} from '../../services/db/types';
import ISubjectUpdateFieldObj from "./ISubjectUpdateFieldObj";
import ISubjectUpdateDataObj from "./ISubjectUpdateDataObj";
import Field from "../../query_genrators/Field";
import IQuery from "../../query_genrators/IQuery";
import SubjectDBRow from "./SubjectDBRow";
import subjectFiller from "./SubjectFiller";
import ISubjectGet from "./ISubjectGet";
import ISubjectSet from "./ISubjectSet";
import ISubjectSearch from "./ISubjectSearch";

const subjectFactory = async (tenent:Tenent):Promise<any> =>{

    const tenentId:number = tenent.tenentId;
    const tenentStore:ITenentStore = await tenent.tenentStore;
    const tenentQG:TenentQG = new Tenent.queryGenerator(tenentId);
    const subjectQG:SubjectQG = tenentQG.getSubjectQG(tenentStore);
    const stored = tenentStore.storeForSubject;

    class Subject{

        public static queryGenerator:SubjectQG = subjectQG;
        private static manyExecute:multipleExecute = pool.manyExecute;
        public static execute:myExecute = pool.execute;

        
        public id:number;
        private _account?:string;
        private _passwordHash?:string;
        private _oldPasswordHash?:string | null;
        private _passwordChangedAt?:Date | null;
        private _enableMfa?:boolean;
        private _accountVerified?:boolean;

        public get:ISubjectGet;
        public set:ISubjectSet;
        public search:ISubjectSearch<Subject>;

        public execute:myExecute;
        private manyExecute:multipleExecute;

        private changes:{fields:ISubjectUpdateFieldObj, dataObj:ISubjectUpdateDataObj};

        private decoratorFillers:subjectFiller[];

        private constructor(row:SubjectDBRow){
            this.id = row.id;
            this.fill(row);

            this.execute = pool.execute;
            this.manyExecute = pool.manyExecute;

            this.changes = {
                fields : {},
                dataObj : {}
            }

            this.decoratorFillers = [];

            this.get = {

                account :async ():Promise<string> =>{
                    if(this._account !== undefined){
                        return this._account
                    }else{
                        await this.populateFromDB();
                        return this._account!;
                    }
                },

                passwordHash : async ():Promise<string> => {
                    if(this._passwordHash !== undefined){
                        return this._passwordHash;
                    }else{
                        await this.populateFromDB();
                        return this._passwordHash!;
                    }
                },

                oldPasswordHash : async ():Promise<string | null> =>{
                    if(this._oldPasswordHash !== undefined){
                        return this._oldPasswordHash;
                    }else{
                        await this.populateFromDB();
                        return this._oldPasswordHash!;
                    }
                },

                passwordChangedAt : async ():Promise<Date | null> =>{
                    if(this._passwordChangedAt !== undefined){
                        return this._passwordChangedAt;
                    }else{
                        await this.populateFromDB();
                        return this._passwordChangedAt!;
                    }
                },

                enableMfa : async ():Promise<boolean> =>{
                    if(this._enableMfa !== undefined){
                        return this._enableMfa;
                    }else{
                        await this.populateFromDB();
                        return this._enableMfa!;
                    }
                },

                accountVerified : async ():Promise<boolean> =>{
                    if(this._accountVerified !== undefined){
                        return this._accountVerified;
                    }else{
                        await this.populateFromDB();
                        return this._accountVerified!;
                    }
                }

            };

            this.set = {

                account : (account:string):void =>{
                    this._account = account;
                    this.changes.fields.account = Subject.queryGenerator.writableFields.account;
                    this.changes.dataObj.account = account;
                },

                passwordHash : (passwordHash:string) =>{
                    this._passwordHash = passwordHash;
                    this.changes.fields.passwordHash = Subject.queryGenerator.writableFields.passwordHash;
                    this.changes.dataObj.passwordHash = passwordHash;
                },

                passwordChangedAt : (passwordChangedAt:Date | null):void =>{
                    this._passwordChangedAt = passwordChangedAt;
                    this.changes.fields.passwordChangedAt = Subject.queryGenerator.writableFields.passwordChangedAt;
                    this.changes.dataObj.passwordChangedAt = passwordChangedAt;
                },

                oldPasswordHash : (oldPasswordHash:string | null):void =>{
                    this._oldPasswordHash = oldPasswordHash;
                    this.changes.fields.oldPasswordHash = Subject.queryGenerator.writableFields.oldPasswordHash;
                    this.changes.dataObj.oldPasswordHash = oldPasswordHash;
                },

                enableMfa : (enableMfa:boolean):void =>{
                    this._enableMfa = enableMfa;
                    this.changes.fields.enableMfa = Subject.queryGenerator.writableFields.enableMfa;
                    this.changes.dataObj.enableMfa = enableMfa;
                },

                accountVerified : (accountVerified:boolean):void =>{
                    this._accountVerified = accountVerified;
                    this.changes.fields.accountVerified = Subject.queryGenerator.writableFields.accountVerified;
                    this.changes.dataObj.accountVerified = accountVerified;
                } 

            };

            this.search = {

                byAccount :async (account:string):Promise<Subject> => {
                    const allReadableFields:Field[] = Object.values(Subject.queryGenerator.readableFields);
        
                    const query:IQuery = Subject.queryGenerator.select.byAccount({
                        account,
                        limit : 1
                    },...allReadableFields);
        
                    return this.execute(query)
                    .then(function captureTheFirstResult(result:SubjectDBRow[]):SubjectDBRow{
                        if(result[0] !== undefined){
                            return result[0];
                        }else{
                            throw new Error("Row Doesn't Exist");
                        }
                    })
                    .then(function constructTheObject(row:SubjectDBRow):Subject{
                        return new Subject(row);
                    })
                },

                byId : async (id:number):Promise<Subject> =>{
                    const allReadableFields:Field[] = Object.values(Subject.queryGenerator.readableFields);
        
                    const query:IQuery = Subject.queryGenerator.select.byId({
                        id,
                        limit : 1
                    },...allReadableFields);
        
                    return this.execute(query)
                    .then(function captureTheFirstResult(result:SubjectDBRow[]):SubjectDBRow{
                        if(result[0] !== undefined){
                            return result[0];
                        }else{
                            throw new Error("Row Doesn't Exist");
                        }
                    })
                    .then(function constructTheObject(row:SubjectDBRow):Subject{
                        return new Subject(row);
                    })
                }
            };
        }

        public async saveChanges():Promise<void>{
            const id:number = await this.id;

            const changedFields:Field[] = Object.values(this.changes.fields);
            const queryData:ISubjectUpdateDataObj = this.changes.dataObj;

            const query:IQuery = Subject.queryGenerator.update.byId({
                id,
                ...queryData
            },...changedFields);

            
            return this.execute(query)
            .then(()=>{
                this.changes.dataObj = {};
                this.changes.fields = {};
            });
        }

        private fill(row:SubjectDBRow):void{
            this.decoratorFillers.forEach(filler=>{
                filler(row);
            });

            this._account = row.account;
            this._oldPasswordHash = row.oldPasswordHash;
            this._passwordChangedAt = row.passwordChangedAt;
            this._passwordHash = row.passwordHash;
            this._accountVerified = row.accountVerified;
            this._enableMfa = row.enableMfa;
        }

        private async populateFromDB():Promise<void>{
            const subject:Subject = this;
            const id:number = this.id;

            const allReadableFields:Field[] = Object.values(Subject.queryGenerator.readableFields);

            const query:IQuery = Subject.queryGenerator.select.byId({
                id,
                limit : 1
            },...allReadableFields);

            return this.execute(query)
            .then(function captureTheFirstResult(result:SubjectDBRow[]):SubjectDBRow{
                if(result[0] !== undefined){
                    return result[0];
                }else{
                    throw new Error("Row Doesn't Exist");
                }
            })
            .then(function storeTheRowAndReturnTheVariable(row:SubjectDBRow):void{
                subject.fill(row);
            });
        }

        public async delete():Promise<void>{
            const query:IQuery = Subject.queryGenerator.delete.byId({
                id:this.id
            });

            await this.execute(query);
        }

    }

    return Subject;
}

export default subjectFactory;