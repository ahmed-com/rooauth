import TenentQG from './TenentQG';

export default class CreatedAtDecorator extends TenentQG{
    constructor(tQG:TenentQG){
        super(tQG.id);
        
        this.extraSubjectFields = tQG.extraSubjectFields + 'data JSON NULL,';
        this.extraSubjectInsertionFields = {
            fields : tQG.extraSubjectInsertionFields.fields + 'data,',
            values : tQG.extraSubjectInsertionFields.values + ':data,'
        }
    }
}