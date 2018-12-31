import { ObjectId } from "bson";

export class TeacherEntity {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    fullName: string;
    bio: string;
    imageUrl: string;
}