import Field from '../Field';
import LoginQG from './LoginQG';

export default class LoggedAt extends LoginQG{

    private decoratorDefault:string;
    private decoratorField:Field;

    constructor(lQG:LoginQG){
        super(lQG.id);

        this.decoratorDefault = 'NOW()';
        this.decoratorField = {
            default : this.decoratorDefault,
            definetion : `logged_at DATETIME NOT NULL DEFAULT ${this.decoratorDefault}`,
            name : "logged_at",
            insertionValue : `IFNULL(:loggedAt,${this.decoratorDefault})`,
            updateValue : ':loggedAt'
        }

        this.extraFields = lQG.extraFields + this.decoratorField.definetion + ',';
        this.extraInsertionFields = {
            fields : lQG.extraInsertionFields.fields + this.decoratorField.name + ',',
            values : lQG.extraInsertionFields.values + this.decoratorField.insertionValue + ','
        }
    }
}