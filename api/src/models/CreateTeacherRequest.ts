import { Validator } from "../helpers/Validator";

export class CreateTeacherRequest{
    firstName: string;
    lastName: string;
    fullName: string;
    bio: string;
    imageUrl: string;
    
    constructor(obj?: CreateTeacherRequest){
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
        var validator = new Validator<CreateTeacherRequest>(this);

        validator.propValidator("firstName", true)
            .typeOf("string")
            .notEmpty()
            .maxLength(30);

        validator.propValidator("lastName", true)
            .typeOf("string")
            .notEmpty()
            .maxLength(30);

        validator.propValidator("fullName", true)
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