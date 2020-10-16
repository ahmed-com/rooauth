class QueryGenerator{

    constructor (tenentId){
      this.tenentId = tenentId;
    }
    
    static createTenentTable(){
      return "";
    }
  
    createSubjectsTable(){
      return ``;
    }

    createSubjectsTableWithMFA(){
        return ``;
    }

    createSubjectsTableWithPhoto(){
        return ``;
    }

    createSubjectsTableWithPhotoAndMFA(){
        return ``;
    }
  
    createSessionsTable(){
        return ``;
    }   

    createLoginsTable(){
        return ``;
    }

    insertSubject(){
        return ``;
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