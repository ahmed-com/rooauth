import Field from '../Field';
import LoginQG from './LoginQG';

export default class LoggedAt extends LoginQG{

    constructor(lQG:LoginQG){
        super(lQG.id);

        const decoratorDefault:string = 'NOW()';
        const decoratorField:Field = {
            default : decoratorDefault,
            definetion : `logged_at DATETIME NOT NULL DEFAULT ${decoratorDefault}`,
            name : "logged_at",
            insertionValue : `IFNULL(:loggedAt,${decoratorDefault})`,
            updateValue : ':loggedAt'
        };
        
        this.fields = {...lQG.fields , decoratorField};
        this.readableFields = {...lQG.readableFields , decoratorField};
    }
}