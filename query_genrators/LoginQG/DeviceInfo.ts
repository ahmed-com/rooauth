import LoginQG from './LoginQG';

export default class DeviceInfo extends LoginQG{
    constructor(lQG:LoginQG){
        super(lQG.id);
        
        this.extraFields = lQG.extraFields + 'device_info VARCHAR(255) NULL,';
        this.extraInsertionFields = {
            fields : lQG.extraInsertionFields.fields + 'device_info,',
            values : lQG.extraInsertionFields.values + ':deviceInfo,'
        }
    }
}