import LoginQG from './LoginQG';

export default class LoggedAt extends LoginQG{

    private decoratorDefault:string;

    constructor(lQG:LoginQG){
        super(lQG.id);

        this.decoratorDefault = 'NOW()';

        this.extraFields = lQG.extraFields + `logged_at DATETIME NOT NULL DEFAULT ${this.decoratorDefault},`;
        this.extraInsertionFields = {
            fields : lQG.extraInsertionFields.fields + 'logged_at,',
            values : lQG.extraInsertionFields.values + `IFNULL(:loggedAt,${this.decoratorDefault}),`
        }
    }
}