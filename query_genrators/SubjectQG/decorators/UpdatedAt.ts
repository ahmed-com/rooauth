import Field from '../../Field';
import SubjectQG from '../SubjectQG';

export default class UpdatedAt extends SubjectQG{

    constructor(sQG:SubjectQG){
        super(sQG.id);

        const decoratorField:Field = {
            name : 'updatedAt',
            definetion : 'updatedAt DATETIME NULL',
            insertionValue : ':updatedAt',
            updateValue : ':updatedAt'
        }
        
        this.fields = {...sQG.fields , updatedAt:decoratorField};
        this.readableFields = {...sQG.readableFields , updatedAt:decoratorField};
        this.writableFields = {...sQG.writableFields , updatedAt:decoratorField};
    }
}