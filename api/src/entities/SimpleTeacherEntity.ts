import { ObjectId } from "bson";

export class SimpleTeacherEntity {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    fullName: string;
}