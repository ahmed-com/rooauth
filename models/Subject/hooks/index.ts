import BeforeUpdate from "./BeforeUpdate";
import AfterUpdate from "./AfterUpdate";
import BeforeInsert from "./BeforeInsert";
import AfterInsert from "./AfterInsert";

export type BeforeInsertHook<Subject> = BeforeInsert<Subject>
export type AfterInsertHook<Subject> = AfterInsert<Subject>
export type BeforeUpdateHook<Subject> = BeforeUpdate<Subject>
export type AfterUpdateHook<Subject> = AfterUpdate<Subject>