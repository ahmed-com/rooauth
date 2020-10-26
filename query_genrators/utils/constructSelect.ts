import Field from "../Field";
import pagination from './pagination';

export default function constructSelect(fields:Field[], tableName:string , condition:string, ignorePagination:boolean):string{
    let fieldsString:string;

    if (fields.length === 0){
        fieldsString = '*';
    }else{
        fieldsString = fields[0].name || '';

        for (let index = 1; index < fields.length; index++) {
            const field:Field = fields[index];
            fieldsString += ',' + field.name;
        }
    }

    const paginationString:string = pagination(ignorePagination);

    return `SELECT ${fieldsString} FROM ${tableName} WHERE ${condition} ${paginationString}`;
}