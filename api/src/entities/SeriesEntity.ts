import { ObjectId } from "bson";

export class SeriesEntity {
    _id: ObjectId;
    title: string;
    description: string;
    image: string;
    imageSquare: string;
}