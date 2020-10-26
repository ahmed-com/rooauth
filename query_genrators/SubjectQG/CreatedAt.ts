import Field from '../Field';
import SubjectQG from './SubjectQG';

export default class CreatedAt extends SubjectQG{

    constructor(sQG:SubjectQG){
        super(sQG.id);

        const decoratorDefault:string = 'NOW()';
        const decoratorField:Field = {
            default : decoratorDefault,
            name : 'created_at',
            insertionValue : `IFNULL(:createdAt,${decoratorDefault})`,
            definetion : `created_at DATETIME NOT NULL DEFAULT ${decoratorDefault}`,
            updateValue : ':createdAt'
        }

        this.fields = {...sQG.fields , decoratorField};
        this.readableFields = {...sQG.readableFields , decoratorField};
        this.writableFields = {...sQG.writableFields , decoratorField};
    }
}