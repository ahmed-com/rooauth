import Field from '../../Field';
import SubjectQG from '../SubjectQG';

export default class Data extends SubjectQG{

    constructor(sQG:SubjectQG){
        super(sQG.id);

        const decoratorField:Field = {
            name : 'data',
            definetion : 'data JSON NULL',
            insertionValue : ':data',
            updateValue : ':data'
        }
        
        this.fields = {...sQG.fields , data:decoratorField};
        this.readableFields = {...sQG.readableFields , data:decoratorField};
        this.writableFields = {...sQG.writableFields , data:decoratorField};

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