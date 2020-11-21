export default function constructDelete(tableName:string,condition:string, pagination:string):string{
    let conditionalStatement:string = '';

    if(condition !== '') conditionalStatement = `WHERE ${condition} `;

    return `DELETE FROM ${tableName} ${conditionalStatement} `;
}