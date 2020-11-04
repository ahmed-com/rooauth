import IQuery from "../../../query_genrators/IQuery";
import ISubjectUpdateDataObj from "../ISubjectUpdateDataObj";
import ISubjectUpdateFieldObj from "../ISubjectUpdateFieldObj";

type UpdateData = {
    dataObj:ISubjectUpdateDataObj,
    fields:ISubjectUpdateFieldObj
}

type AfterUpdateHook<Subject> = (subject:Subject,updateData:UpdateData,query:IQuery) => UpdateData

export default AfterUpdateHook;