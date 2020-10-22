// these will be the static variables when using TS
const subjectsTableEngine = 'InnoDB';
const sessionsTableEngine = 'InnoDB';
const loginsTableEngine = 'InnoDB';
const tenentsTableEngine = 'InnoDB';
const clientsTableEngine = 'InnoDB';
const ipsTableEngine = 'InnoDB';
const extraTenentFields = '';
const extraClientFields = '';
const extraIpFields = '';
const privateKeyLength = 255;
const publicKeyLength = 255;
const defaultMaxSession = 15;
const defaultIpRateLimit = 100; // request per second

class TenentQueryGenerator{

    constructor (tenentId){
      this.tenentId = tenentId;
      this.extraSubjectFields = '';
      this.extraSessionFields = '';
      this.extrasLoginFields = '';
      this.extraSubjectInsertionFields = {fields : '', values : ''};
      this.extraSessionInsertionFields = {fields : '', values : ''};
      this.extraLoginInsertionFields = {fields : '', values : ''};
    }
    
    static createTenentTable(){
      return `CREATE TABLE IF NOT EXISTS tenents (
        tenent_id INTEGER UNSIGNED NOT NULL UNIQUE auto_increment,
        subject_schema JSON NULL,
        mfa BOOLEAN NULL,
        mfaMethod VARCHAR (64),
        private_key VARCHAR(255),
        public_key VARCHAR(255),
        allow_ip_white_listing BOOLEAN NOT NULL,
        max_session INTEGER NOT NULL DEFAULT ${defaultMaxSession},
        ${extraTenentFields}
        ip_rate_limit INTEGER NOT NULL DEFAULT ${defaultIpRateLimit}
    )ENGINE=${tenentsTableEngine};`;
    }

    static createIpsTable(){
        return `CREATE TABLE IF NOT EXISTS auth.ips(
            ip CHAR(39),
            tenent_id INTEGER UNSIGNED NOT NULL,
            ${extraIpFields}
            FOREIGN KEY (tenent_id) REFERENCES tenents(tenent_id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${ipsTableEngine};`;
    }

    static createClientsTable(){
        return `CREATE TABLE IF NOT EXISTS clients(
            client_id INTEGER UNSIGNED NOT NULL UNIQUE auto_increment,
            client_secret VARCHAR(255) NOT NULL,
            user_id INTEGER UNSIGNED NOT NULL,
            tenent_id INTEGER UNSIGNED NOT NULL,
            ${extraClientFields}
            FOREIGN KEY (tenent_id) REFERENCES tenents(tenent_id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${clientsTableEngine};`;
    }
  
    createSubjectsTable(){
      return `CREATE TABLE IF NOT EXISTS tno${this.tenentId}subjects (
        id INTEGER UNSIGNED NOT NULL UNIQUE auto_increment,
        account VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        old_password_hash VARCHAR(255) NULL,
        password_changed_at DATETIME NULL,
        account_verified BOOLEAN NOT NULL DEFAULT false,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NULL,
        data JSON NULL,
        ${this.extraSubjectFields}
        PRIMARY KEY (id)
    ) ENGINE=${subjectsTableEngine};`;
    }
  
    createSessionsTable(){
        return `CREATE TABLE IF NOT EXISTS tno${this.tenentId}tokens (
            jti INTEGER UNSIGNED NOT NULL UNIQUE auto_increment,
            sub INTEGER UNSIGNED NOT NULL,
            exp DATETIME NOT NULL,
            verified BOOLEAN NOT NULL,
            ${this.extraSessionFields}
            PRIMARY KEY (jti),
            FOREIGN KEY (sub) REFERENCES tno${this.tenentId}subjects(id) ON DELETE CASCADE ON UPDATE CASCADE
        )ENGINE=${sessionsTableEngine};`;
    }   

    createLoginsTable(){
        return `CREATE TABLE IF NOT EXISTS tno${this.tenentId}logins (
            subject_id INTEGER UNSIGNED NOT NULL,
            jti INTEGER UNSIGNED NULL,
            password_login BOOLEAN NULL,
            client_id INTEGER UNSIGNED NOT NULL,
            ip CHAR(39),
            logged_at DATETIME NOT NULL,
            device_info VARCHAR(255) NULL,
            ${this.extrasLoginFields}
            FOREIGN KEY (jti) REFERENCES tno${this.tenentId}tokens(jti) ON DELETE SET NULL ON UPDATE CASCADE
        )ENGINE=${loginsTableEngine};`;
    }

    insertSubject(){
        return `INSERT INTO tno${this.tenentId}subjects (
            id,
            account,
            password_hash,
            created_at,
            ${this.extraSubjectInsertionFields.fields}
            data
            ) VALUES (
            DEFAULT,
            :account,
            :passwordHash,
            :now,
            ${this.extraSubjectInsertionFields.values}
            :data
            );`;
    }

    deleteSubject(){
        return ``;
    }

    getSubjectByEmail(){
        return ``;
    }

    getSubjectById(){
        return ``;
    }

    getSubjectsCreatedBetweenDate(){
        return ``;
    }

    getSubjectsUpdatedBetweenDate(){
        return ``;
    }

    getSubjectsEmailVerified(offset,count){
        return ``;
    }

    getSubjectsEmailUnverified(offset,count){
        return ``;
    }

    searchSubjectsByDataField(offset,count){
        return ``;
    }

    searchSubjectsByDataFields(offset,count,numberOfFields = 1){
        if (numberOfFields === 1) return this.searchSubjectsByDataField(offset,count);
        // TO-DO
    }

    updateSubjectEmail(){
        return ``;
    }

    updateSubjectPassword(){
        return ``;
    }

    updateSubjectPhoto(){
        return ``;
    }

    updateSubjectDataById(){
        return ``;
    }
    
    updateSubjectDataFieldById(){
        return ``;
    }
    
    updateSubjectDataFieldsById(numberOfFields = 1){
        if (numberOfFields === 1) return this.updateSubjectDataFieldById();
    }

    updateSubjectDataByEmail(){
        return ``;
    }
    
    updateSubjectDataFieldByEmail(){
        return ``;
    }
    
    updateSubjectDataFieldsByEmail(numberOfFields = 1){
        if (numberOfFields === 1) return this.updateSubjectDataFieldByEmail();
    }

    markSubjectEmailVerified(){
        return ``;
    }

    markSubjectEmailUnverified(){
        return ``;
    }

    enableSubjectMFA(){
        return ``;
    }

    disableSubjectMFA(){
        return ``;
    }
  
}

class TenentWithPhotoQueryGenerator extends TenentQueryGenerator{ // a decorator class 

    constructor(tenentQueryGenerator){
        super(tenentQueryGenerator.tenentId);
        this.extraSubjectFields = tenentQueryGenerator.extraSubjectFields + 'photo VARCHAR(255) NULL,' ;
        this.extraSubjectInsertionFields = {
            fields : tenentQueryGenerator.extraSubjectInsertionFields.fields + 'photo,',
            values : tenentQueryGenerator.extraSubjectInsertionFields.values + ':photo'
        }
    }
}

class TenentWithMFAQueryGenerator extends TenentQueryGenerator{ // a decorator class 

    constructor(tenentQueryGenerator){
        super(tenentQueryGenerator.tenentId);
        this.extraSubjectFields = tenentQueryGenerator.extraSubjectFields + 'mfa BOOLEAN NOT NULL,';
        this.extraSubjectInsertionFields = {
            fields : tenentQueryGenerator.extraSubjectInsertionFields.fields + 'mfa,',
            values : tenentQueryGenerator.extraSubjectInsertionFields.values + ':mfa'
        }
    }
}