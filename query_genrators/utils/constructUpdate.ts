import Field from "../Field";

export default function constructUpdate(fields:Field[], tableName:string , condition:string):string{
    let fieldsString:string;
    let conditionalStatement:string = '';

    if(condition !== '') conditionalStatement = `WHERE ${condition} `;

    if (fields.length === 0){
        fieldsString = '?';
    }else{
        fieldsString = `${fields[0].name} = ${fields[0].updateValue}`;

        for (let index = 1; index < fields.length; index++) {
            const field:Field = fields[index];
            fieldsString += ',' + `${field.name} = ${field.updateValue}`;
        }
    }

    return `UPDATE ${tableName} SET ${fieldsString} ${conditionalStatement} `;
}