import { ObjectId } from "bson";

export class SimpleSeriesEntity {
    _id: ObjectId;
    title: string;
    image: string;
    imageSquare: string;
}