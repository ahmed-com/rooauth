import Field from '../Field';
import LoginQG from './LoginQG';

export default class DeviceInfo extends LoginQG{

    constructor(lQG:LoginQG){
        super(lQG.id);

        const decoratorField:Field = {
            definetion:'device_info VARCHAR(255) NULL',
            name:'device_info',
            insertionValue:':deviceInfo',
            updateValue:':deviceInfo'
        }
        
        this.fields = {...lQG.fields , decoratorField};
        this.readableFields = {...lQG.fields , decoratorField};
    }
}