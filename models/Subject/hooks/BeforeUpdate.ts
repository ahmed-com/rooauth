import ISubjectUpdateDataObj from "../ISubjectUpdateDataObj";
import ISubjectUpdateFieldObj from "../ISubjectUpdateFieldObj";

type UpdateData = {
    dataObj:ISubjectUpdateDataObj,
    fields:ISubjectUpdateFieldObj
}

type BeforeUpdateHook<Subject> = (subject:Subject,updateData:UpdateData) => UpdateData

export default BeforeUpdateHook;