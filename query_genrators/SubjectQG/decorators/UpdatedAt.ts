import Field from '../../Field';
import SubjectQG from '../SubjectQG';

export default class UpdatedAt extends SubjectQG{

    constructor(sQG:SubjectQG){
        super(sQG.id);

        const decoratorDefault:string = 'NOW()';
        const decoratorField:Field = {
            default:decoratorDefault,
            name : 'updatedAt',
            definetion : 'updatedAt DATETIME NULL',
            insertionValue : ':updatedAt',
            updateValue : ':updatedAt'
        }
        
        this.fields = {...sQG.fields , updatedAt:decoratorField};
        this.readableFields = {...sQG.readableFields , updatedAt:decoratorField};
        this.writableFields = {...sQG.writableFields , updatedAt:decoratorField};

        this.select = {
            // TO-DO
            ...sQG.select
        };

        this.update = {
            // TO-DO
            ...sQG.update
        };

        this.delete = {
            // TO-DO
            ...sQG.delete
        }
        
    }
}