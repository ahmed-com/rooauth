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
    },
    
    multipleExecute

}

function multipleExecute(performAction:any):Promise<void>{
    const connection = dbPool.getConnection();

    return new Promise<void>((globalResolve, globalReject)=>{

        connection.beginTransaction((transactionError:Error)=>{

            if(transactionError){ 
                connection.rollback(function handleTransactionError() {
                    connection.release();
                    globalReject(transactionError);
                })
            }else{ // successfully started a transaction
            
                performAction(

                    function execute(query:string,data:object):Promise<any> {
                        const [unnamedQuery,dataArray] = toUnnamed(query,data);

                        return new Promise<any>((resolve,reject)=>{
                            connection.execute(unnamedQuery, dataArray,(executeError:Error, rows:basic[])=>{
                                if (executeError) {
                                    connection.rollback(function handleExecuteError(){

                                        reject(executeError);       // this shall reject only this single execute promise
                                        globalReject(executeError); // this will reject the entire transaction

                                        connection.release();
                                    });
                                } else { // this means only this promise succeeded but not the entire transaction
                                    resolve(rows); 
                                }
                            }); 
                        });

                    },

                    function endExecute():Promise<any> { // this function shall be called when all the execute promises have succeeded
                        return new Promise<any>((resolve,reject)=>{
                            connection.commit((commitError:Error)=>{
                                if(commitError){
                                    connection.rollback(function handleCommitError(){

                                        reject(commitError);       // this rejects the commit
                                        globalReject(commitError); // this rejects the entire transaction

                                        connection.release();
                                    });
                                }else{ // now this means that the commit succeeded which means a successful transaction
                                    globalResolve();
                                    resolve();
                                    connection.release();
                                }
                            })
                        });
                    }

                );

            }

        });

    });
}


export default myPool;