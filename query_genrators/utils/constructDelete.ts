export default function constructDelete(tableName:string,condition:string):string{
    let conditionalStatement:string = '';

    if(condition !== '') conditionalStatement = `WHERE ${condition} `;

    return `DELETE FROM ${tableName} ${conditionalStatement} `;
}