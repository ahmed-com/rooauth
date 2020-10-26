import Field from '../Field';
import SubjectQG from './SubjectQG';

export default class CreatedAt extends SubjectQG{

    private decoratorDefault:string;
    private decoratorField:Field;

    constructor(sQG:SubjectQG){
        super(sQG.id);

        this.decoratorDefault = 'NOW()';
        this.decoratorField = {
            default : this.decoratorDefault,
            name : 'created_at',
            insertionValue : `IFNULL(:createdAt,${this.decoratorDefault})`,
            definetion : `created_at DATETIME NOT NULL DEFAULT ${this.decoratorDefault}`,
            updateValue : ':createdAt'
        }

        this.extraFields = sQG.extraFields + this.decoratorField.definetion + ',';
        this.extraInsertionFields = {
            fields : sQG.extraInsertionFields.fields + this.decoratorField.name + ',',
            values : sQG.extraInsertionFields.values + this.decoratorField.insertionValue + ','
        }
    }
}