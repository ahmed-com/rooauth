import Field from '../../Field';
import IQuery from '../../IQuery';
import { constructUpdate } from '../../utils';
import TokenQG from '../TokenQG';

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

        this.fields = {...tQG.fields , verified:decoratorField};
        this.readableFields = {...tQG.readableFields , verified:decoratorField};
        this.writableFields = {...tQG.writableFields , verified:decoratorField};

        this.update ={
            byJti : (queryData:{jti:number,verified:boolean},verifiedField:Field):IQuery =>{
                const condition:string = "jti = :jti";
                const tableName:string = `tno${this.id}tokens`
                const queryStr:string = constructUpdate([verifiedField],tableName,condition);
                return {queryStr , queryData};
            },

            ...tQG.update
        };

        this.select = {
            // TO-DO
            ...tQG.select
        };

        this.delete = {
            // TO-DO
            ...tQG.delete
        }
    }
}