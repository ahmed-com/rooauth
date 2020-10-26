import Field from '../Field';
import TokenQG from './TokenQG';

export default class Verified extends TokenQG{

    constructor (tQG:TokenQG){
        super(tQG.id);

        const decoratorDefault:string = 'FALSE';
        const decoratorField:Field = {
            default: decoratorDefault,
            insertionValue:`IFNULL(:verified,${decoratorDefault})`,
            definetion:`verified BOOLEAN NOT NULL DEFAULT ${decoratorDefault}`,
            name:'verified',
            updateValue:':verified'
        }

        this.fields = {...tQG.fields , decoratorField};
        this.readableFields = {...tQG.readableFields , decoratorField};
        this.writableFields = {...tQG.writableFields , decoratorField};
    }
}