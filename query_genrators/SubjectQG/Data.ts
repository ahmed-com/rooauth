import SubjectQG from './SubjectQG';

export default class Data extends SubjectQG{
    constructor(sQG:SubjectQG){
        super(sQG.id);
        
        this.extraFields = sQG.extraFields + 'data JSON NULL,';
        this.extraInsertionFields = {
            fields : sQG.extraInsertionFields.fields + 'data,',
            values : sQG.extraInsertionFields.values + ':data,'
        }
    }
}