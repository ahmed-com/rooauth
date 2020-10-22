import TenentQG from './TenentQG';

export default class CreatedAtDecorator extends TenentQG{
    constructor(tQG:TenentQG){
        super(tQG.id);
        this.extraSubjectFields = tQG.extraSubjectFields + 'created_at DATETIME NOT NULL,';
        this.extraSubjectInsertionFields = {
            fields : tQG.extraSubjectInsertionFields.fields + 'created_at,',
            values : tQG.extraSubjectInsertionFields.values + ':created_at,'
        }
    }
}