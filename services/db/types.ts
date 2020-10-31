import IQuery from "../../query_genrators/IQuery";

export type basic = string|number|boolean|Date;
export type mysqlCallback = (err:any , rows:Object[])=>void;
export type dbExecute = (query:string, data : basic[], callback:mysqlCallback)=> void;
export type myExecute = (query:IQuery)=> Promise<any>;
export type actionPeroformer = (exe:myExecute) => Promise<void>
export type multipleExecute = (performAction:actionPeroformer) => Promise<void>