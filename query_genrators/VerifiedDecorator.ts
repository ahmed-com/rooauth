import TenentQG from './TenentQG';

export default class VerifiedDecorator extends TenentQG{

    private verified_default:string;

    constructor (tQG:TenentQG){
        super(tQG.id);

        this.verified_default = 'FALSE';

        this.extraSessionFields = tQG.extraSessionFields + `verified BOOLEAN NOT NULL DEFAULT ${this.verified_default},`
        this.extraSessionInsertionFields = {
            fields : tQG.extraSessionInsertionFields.fields + `verified,`,
            values : tQG.extraSessionInsertionFields.values + `IFNULL(:verified,${this.verified_default})`
        }
    }
}