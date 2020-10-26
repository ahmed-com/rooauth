import Field from '../Field';
import TokenQG from './TokenQG';

export default class Verified extends TokenQG{

    private decoratorDefault:string;
    private decoratorField:Field;

    constructor (tQG:TokenQG){
        super(tQG.id);

        this.decoratorDefault = 'FALSE';
        this.decoratorField = {
            default: this.decoratorDefault,
            insertionValue:`IFNULL(:verified,${this.decoratorDefault})`,
            definetion:`verified BOOLEAN NOT NULL DEFAULT ${this.decoratorDefault}`,
            name:'verified',
            updateValue:':verified'
        }

        this.extraFields = tQG.extraFields + this.decoratorField.definetion + ',';
        this.extraInsertionFields = {
            fields : tQG.extraInsertionFields.fields + this.decoratorField.name + ',' ,
            values : tQG.extraInsertionFields.values + this.decoratorField.insertionValue + ','
        }
    }
}