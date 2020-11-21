import Field from '../Field';

export default function insertString(fieldsArray:Field[] , tableName:string):string{
    let fieldsString:string = fieldsArray[0].name || '';
    let valuesString:string = fieldsArray[0].insertionValue || '';

    for (let index = 1; index < fieldsArray.length; index++) {
        const field:Field = fieldsArray[index];
        fieldsString += ',' + field.name;
        valuesString += ',' + field.insertionValue;
    }

    return `INSERT INTO ${tableName} (${fieldsString}) VALUES (${valuesString});`
}