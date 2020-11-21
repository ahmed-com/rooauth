import { myExecute , multipleExecute } from "./types";

export default interface PromisifiedPool{
    execute : myExecute,
    manyExecute : multipleExecute
}