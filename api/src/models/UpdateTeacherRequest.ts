import { Validator } from "../helpers/Validator";

export class UpdateTeacherRequest{
    firstName: string;
    lastName: string;
    fullName: string;
    bio: string;
    imageUrl: string;

    constructor(obj?: UpdateTeacherRequest){
        if (typeof obj != "object" || !obj){
            return;
        }
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.fullName = obj.fullName;
        this.bio = obj.bio;
        this.imageUrl = obj.imageUrl;
    }

    validate(): string{
        var validator = new Validator<UpdateTeacherRequest>(this);

        validator.propValidator("firstName", false)
            .typeOf("string")
            .notEmpty()
            .maxLength(30);

        validator.propValidator("lastName", false)
            .typeOf("string")
            .notEmpty()
            .maxLength(30);

        validator.propValidator("fullName", false)
            .typeOf("string")
            .notEmpty()
            .minLength(3)
            .maxLength(60);

        validator.propValidator("bio", false)
            .typeOf("string")
            .notEmpty()
            .maxLength(2000);

        validator.propValidator("imageUrl", false)
            .typeOf("string")
            .notEmpty()
            .url();

        return validator.getErrors()[0];
    }
}