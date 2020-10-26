import Field from '../Field';
import SubjectQG from './SubjectQG';

export default class Data extends SubjectQG{

    private decoratorField:Field;

    constructor(sQG:SubjectQG){
        super(sQG.id);

        this.decoratorField = {
            name : 'data',
            definetion : 'data JSON NULL',
            insertionValue : ':data',
            updateValue : ':data'
        }
        
        this.extraFields = sQG.extraFields + this.decoratorField.definetion + ',';
        this.extraInsertionFields = {
            fields : sQG.extraInsertionFields.fields + this.decoratorField.name + ',',
            values : sQG.extraInsertionFields.values + this.decoratorField.insertionValue + ','
        }
    }
}