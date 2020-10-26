import Field from '../Field';
import LoginQG from './LoginQG';

export default class DeviceInfo extends LoginQG{

    private decoratorField:Field;

    constructor(lQG:LoginQG){
        super(lQG.id);

        this.decoratorField = {
            definetion:'device_info VARCHAR(255) NULL',
            name:'device_info',
            insertionValue:':deviceInfo',
            updateValue:':deviceInfo'
        }
        
        this.extraFields = lQG.extraFields + this.decoratorField.definetion + ',';
        this.extraInsertionFields = {
            fields : lQG.extraInsertionFields.fields + this.decoratorField.name + ',',
            values : lQG.extraInsertionFields.values + this.decoratorField.insertionValue + ','
        }
    }
}