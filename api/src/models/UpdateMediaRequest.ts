import { Validator } from "../helpers/Validator";

export class UpdateMediaRequest{
    title?: string;
    teacherId?: string;
    text?: string;
    seriesId?: string;

    constructor(obj?: UpdateMediaRequest){
        if (!obj){
            return;
        }
        this.title = obj.title;
        this.teacherId = obj.teacherId;
        this.text = obj.text;
        this.seriesId = obj.seriesId;
    }

    validate(): string{
        var validator = new Validator<UpdateMediaRequest>(this);

        validator.propValidator("title", true)
            .typeOf("string")
            .notEmpty()
            .maxLength(150);

        validator.propValidator("teacherId", true)
            .typeOf("string")
            .notEmpty()
            .objectId();

        validator.propValidator("text", true)
            .typeOf("string")
            .notEmpty()
            .maxLength(100);

        validator.propValidator("seriesId", false)
            .typeOf("string")
            .notEmpty()
            .objectId();

        return validator.getErrors()[0];
    }
}