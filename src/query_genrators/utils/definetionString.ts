import Field from '../Field';

export default function definetionString(fieldsArray:Field[]):string{
    let fieldsString:string = fieldsArray[0].definetion || '';

    for (let index = 1; index < fieldsArray.length; index++) {
        const field:Field = fieldsArray[index];
        fieldsString += ',' + field.definetion;
    }

    return fieldsString;
}