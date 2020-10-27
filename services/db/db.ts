const toUnnamed = require('named-placeholders')();
const mysql = require('mysql2');
import dbConfig from '../../config/dbConfig.json';
import PromisifiedPool from "./PromisifiedPool";
import {basic} from './types';

if(!dbConfig.initialized) throw new Error("Project is not yet initialized");

const dbPool = mysql.createPool({
    host : dbConfig.host,
    user : dbConfig.user,
    password : dbConfig.password,
    database : dbConfig.database
});

const myPool:PromisifiedPool = {

    execute : (query:string , data:object):Promise<basic[]> =>{
        const [unnamedQuery,dataArray] = toUnnamed(query,data);
        return new Promise<any>((resolve,reject)=>{
            dbPool.execute(unnamedQuery, dataArray,(err:Error, rows:basic[])=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    }

}

export default myPool;