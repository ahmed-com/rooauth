import Field from '../../Field';
import LoginQG from '../LoginQG';

export default class DeviceInfo extends LoginQG{

    constructor(lQG:LoginQG){
        super(lQG.id);

        const decoratorField:Field = {
            definetion:'deviceInfo VARCHAR(255) NULL',
            name:'deviceInfo',
            insertionValue:':deviceInfo',
            updateValue:':deviceInfo'
        }
        
        this.fields = {...lQG.fields , deviceInfo:decoratorField};
        this.readableFields = {...lQG.fields , deviceInfo:decoratorField};
    }
}