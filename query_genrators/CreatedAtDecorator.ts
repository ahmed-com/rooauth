import TenentQG from './TenentQG';

export default class CreatedAtDecorator extends TenentQG{

    private createdAt_default:string;

    constructor(tQG:TenentQG){
        super(tQG.id);

        this.createdAt_default = 'NOW()';

        this.extraSubjectFields = tQG.extraSubjectFields + `created_at DATETIME NOT NULL DEFAULT ${this.createdAt_default},`;
        this.extraSubjectInsertionFields = {
            fields : tQG.extraSubjectInsertionFields.fields + 'created_at,',
            values : tQG.extraSubjectInsertionFields.values + `IFNULL(:createdAt,${this.createdAt_default})`
        }
    }
}