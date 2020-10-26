import Field from '../Field';
import SubjectQG from './SubjectQG';

export default class Data extends SubjectQG{

    constructor(sQG:SubjectQG){
        super(sQG.id);

        const decoratorField:Field = {
            name : 'data',
            definetion : 'data JSON NULL',
            insertionValue : ':data',
            updateValue : ':data'
        }
        
        this.fields = {...sQG.fields , decoratorField};
        this.readableFields = {...sQG.readableFields , decoratorField};
        this.writableFields = {...sQG.writableFields , decoratorField};
    }
}