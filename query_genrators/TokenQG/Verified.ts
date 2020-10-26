import TokenQG from './TokenQG';

export default class Verified extends TokenQG{

    private decoratorDefault:string;

    constructor (tQG:TokenQG){
        super(tQG.id);

        this.decoratorDefault = 'FALSE';

        this.extraFields = tQG.extraFields + `verified BOOLEAN NOT NULL DEFAULT ${this.decoratorDefault},`
        this.extraInsertionFields = {
            fields : tQG.extraInsertionFields.fields + `verified,`,
            values : tQG.extraInsertionFields.values + `IFNULL(:verified,${this.decoratorDefault}),`
        }
    }
}