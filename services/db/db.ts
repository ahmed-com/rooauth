const toUnnamed = require('named-placeholders')();
const mysql = require('mysql2');
import dbConfig from '../../config/dbConfig.json';
import PromisifiedPool from "./PromisifiedPool";
import {basic , actionPeroformer , myExecute} from './types';

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
    },
    
    manyExecute

}

function manyExecute(performAction:actionPeroformer):Promise<void> {
    const connection = dbPool.getConnection();

    function execute(query:string,data:object):Promise<any> {
        const [unnamedQuery,dataArray] = toUnnamed(query,data);

        return new Promise<any>((resolve,reject)=>{
            connection.execute(unnamedQuery, dataArray,(executeError:Error, rows:basic[])=>{
                if (executeError) {
                    connection.rollback(function handleExecuteError(){
                        reject(executeError);
                        connection.release();
                    });
                } else {
                    resolve(rows); 
                }
            }); 
        });

    }

    function beginTheTransaction():Promise<myExecute> {
        return new Promise((resolve,reject)=>{
            connection.beginTransaction((transactionError:Error)=>{
                if(transactionError){ 
                    connection.rollback(function handleTransactionError() {
                        connection.release();
                        reject(transactionError);
                    })
                }else{
                    resolve(execute);
                }
            });
        });
    }

    function commitTheTransaction():Promise<any> { 
        return new Promise<any>((resolve,reject)=>{
            connection.commit((commitError:Error)=>{
                if(commitError){
                    connection.rollback(function handleCommitError(){
                        reject(commitError);
                        connection.release();
                    });
                }else{
                    resolve();
                    connection.release();
                }
            })
        });
    }

    return beginTheTransaction()
        .then(performAction)
        .then(commitTheTransaction);

}

export default myPool;