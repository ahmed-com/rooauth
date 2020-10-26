import Field from '../Field';
import SubjectQG from './SubjectQG';

export default class UpdatedAt extends SubjectQG{

    private decoratorField:Field;

    constructor(sQG:SubjectQG){
        super(sQG.id);

        this.decoratorField = {
            name : 'updated_at',
            definetion : 'updated_at DATETIME NULL',
            insertionValue : ':updatedAt',
            updateValue : ':updatedAt'
        }
        
        this.extraFields = sQG.extraFields + this.decoratorField.definetion + ',';
        this.extraInsertionFields = {
            fields : sQG.extraInsertionFields.fields + this.decoratorField.name + ',',
            values : sQG.extraInsertionFields.values + this.decoratorField.insertionValue + ','
        }
    }
}