import TenentQG from './TenentQG';

export default class UpdatedAtDecorator extends TenentQG{
    constructor(tQG:TenentQG){
        super(tQG.id);
        this.extraSubjectFields = tQG.extraSubjectFields + 'updated_at DATETIME NULL,';
        this.extraSubjectInsertionFields = {
            fields : tQG.extraSubjectInsertionFields.fields + 'updated_at,',
            values : tQG.extraSubjectInsertionFields.values + ':updated_at,'
        }
    }
}