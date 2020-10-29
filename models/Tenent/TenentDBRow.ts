import SubjectSchema from './Schema';
import MfaMethod from './MfaMethodEnum';

export default interface TenentDBRow{
    tenent_id?:number,
    subject_schema?:SubjectSchema | null,
    mfa_enable_default?:boolean,
    mfa_method?:string,
    private_key_cipher?:string,
    public_key?:string,
    allow_ip_white_listing?:boolean,
    store_logins?:boolean,
    store_login_time?:boolean,
    store_login_device_info?:boolean,
    store_created_at?:boolean,
    store_updated_at?:boolean,
    max_session?:number,
    ip_rate_limit?:number
}