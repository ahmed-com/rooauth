export type basic = string|number|boolean|Date;
export type mysqlCallback = (err:any , rows:Object[])=>void;
export type dbExecute = (query:string, data : basic[], callback:mysqlCallback)=> void;
export type myExecute = (query:string, data : object)=> Promise<any>;