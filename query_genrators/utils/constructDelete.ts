export default function constructDelete(tableName:string,condition:string):string{
    return `DELETE FROM ${tableName} WHERE ${condition} `;
}