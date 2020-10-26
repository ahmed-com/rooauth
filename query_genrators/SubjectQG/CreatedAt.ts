import SubjectQG from './SubjectQG';

export default class CreatedAt extends SubjectQG{

    private decoratorDefault:string;

    constructor(sQG:SubjectQG){
        super(sQG.id);

        this.decoratorDefault = 'NOW()';

        this.extraFields = sQG.extraFields + `created_at DATETIME NOT NULL DEFAULT ${this.decoratorDefault},`;
        this.extraInsertionFields = {
            fields : sQG.extraInsertionFields.fields + 'created_at,',
            values : sQG.extraInsertionFields.values + `IFNULL(:createdAt,${this.decoratorDefault}),`
        }
    }
}