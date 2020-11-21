import {refreshTokenExpirationPeriod} from "../../config/config.json";
 
import Tenent from "../Tenent/Tenent";
import TenentQG from "../../query_genrators/TenentQG/TenentQG";
import TokenQG from "../../query_genrators/TokenQG/TokenQG";
import pool from "../../services/db/db";
import {multipleExecute, myExecute} from '../../services/db/types';
import Field from "../../query_genrators/Field";
import IQuery from "../../query_genrators/IQuery";
import TokenDBRow from "./interfaces/TokenDBRow";
import ITenentStore from "../Tenent/ITenentStore";

const TokenFactory = async (tenent:Tenent):Promise<any> => {
    const tenentId:number = tenent.tenentId;
    const tenentStore:ITenentStore = await tenent.getTenentStore();

    const tenentQG:TenentQG = new Tenent.queryGenerator(tenentId);
    const tokenQG:TokenQG = tenentQG.getTokenQG(tenentStore);

    class Token{
        public static queryGenerator:TokenQG = tokenQG;
        private static manyExecute:multipleExecute = pool.manyExecute;
        public static execute:myExecute = pool.execute;

        public jti:number;
        private _sub?:number;
        private _exp?:string;
        private _verified?:boolean;



        constructor(jti:number){
            this.jti = jti;
        }

        public async isValid():Promise<boolean> {
            const jti:number = this.jti;
            const expField:Field = Token.queryGenerator.readableFields.exp;
            const jtiField:Field = Token.queryGenerator.readableFields.jti;
            const query:IQuery = Token.queryGenerator.select.byJti({
                jti,
                limit : 1
            },jtiField,expField);

            const result:TokenDBRow[] = await Token.execute(query);

            if(result[0] !== undefined){
                const row:TokenDBRow = result[0];
                const expStr:string = row.exp!;
                const expArr:string[] = expStr.split(/[- :]/);
                const unixTime:number = Date.UTC(+expArr[0], +expArr[1]-1, +expArr[2], +expArr[3], +expArr[4], +expArr[5]);
                const now:Date = new Date();
                const expirationDate:Date = new Date(unixTime);

                return expirationDate > now ;
            }else{
                return false;
            }
            
        }

        public async isVerified():Promise<boolean>{
            const isValid:boolean = await this.isValid()
            
            if(!isValid) return false;

            const jti:number = this.jti;
            const verifiedField:Field = Token.queryGenerator.readableFields.verified!;
            const jtiField:Field = Token.queryGenerator.readableFields.jti;

            const query:IQuery = Token.queryGenerator.select.byJti({
                jti,
                limit : 1
            },verifiedField,jtiField);

            const result:TokenDBRow[] = await Token.execute(query);
            const row:TokenDBRow = result[0];

            return row.verified!;
        }

        public async setAsVerified():Promise<void>{
            const isValid:boolean = await this.isValid();
            
            if(!isValid) throw new Error("Not A Valid Token");
            
            const jti:number = this.jti;
            const verifiedField:Field = Token.queryGenerator.writableFields.verified!;
            const query:IQuery = Token.queryGenerator.update.byJti!({
                jti,
                verified: true
            },verifiedField);

            await Token.execute(query);
        }

        public static deleteExpiredTokens(){
            const now:string = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const query:IQuery = Token.queryGenerator.delete.tokensExpiredBeforeDate({
                date: now
            });

            Token.execute(query);
        }

        public static async deleteTokensBySubject(sub:number):Promise<void>{
            const query:IQuery = Token.queryGenerator.delete.bySub({
                sub
            });

            return Token.execute(query);
        }

        public static async insertToken(sub:number):Promise<Token>{
            const expirationDateAsUnix:number = new Date().getTime() + refreshTokenExpirationPeriod;
            const expirationDate:Date = new Date(expirationDateAsUnix);
            const exp:string = expirationDate.toISOString().slice(0, 19).replace('T', ' ');

            const verified:boolean = false;

            const query:IQuery = Token.queryGenerator.insertToken({
                sub,
                exp,
                verified
            });

            const {insertId} = await Token.execute(query);

            return new Token(insertId);
        }

    }

    return Token;
}

export default TokenFactory;
