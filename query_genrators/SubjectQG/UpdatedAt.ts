import SubjectQG from './SubjectQG';

export default class UpdatedAt extends SubjectQG{
    constructor(sQG:SubjectQG){
        super(sQG.id);
        
        this.extraFields = sQG.extraFields + 'updated_at DATETIME NULL,';
        this.extraInsertionFields = {
            fields : sQG.extraInsertionFields.fields + 'updated_at,',
            values : sQG.extraInsertionFields.values + ':updated_at,'
        }
    }
}