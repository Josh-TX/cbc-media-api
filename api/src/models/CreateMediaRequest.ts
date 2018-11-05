import { Validator } from "../helpers/Validator";
import { categoryTree } from "../helpers/categoryTree";

export class CreateMediaRequest{
    dateRecorded: string;
    title: string;
    teacherId: string;
    text: string;
    seriesId: string;
    category: string;
    subCategory: string;
    part: number;
    tags: string[];

    constructor(obj?: CreateMediaRequest){
        if (typeof obj != "object"){
            return;
        }
        this.dateRecorded = obj.dateRecorded;
        this.title = obj.title;
        this.teacherId = obj.teacherId;
        this.text = obj.text;
        this.seriesId = obj.seriesId;
        this.category = obj.category;
        this.subCategory = obj.subCategory;
        this.part = obj.part;
        this.tags = obj.tags;
    }

    validate(): string{
        var validator = new Validator<CreateMediaRequest>(this);

        validator.propValidator("dateRecorded", true)
            .typeOf("string")
            .notEmpty()
            .dateString();

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

        validator.propValidator("category", true)
            .typeOf("string")
            .notEmpty()
            .custom(obj => {
                let catTree = categoryTree.find(z => z.category == obj.category);
                return !!catTree ? null : "category '" + obj.category + "' is not one of the available categories";
            })

        validator.propValidator("subCategory", false)
            .typeOf("string")
            .notEmpty()
            .custom(obj => {
                let catTree = categoryTree.find(z => z.category == obj.category);
                if (catTree){
                    if (!catTree.subCategories.length){
                        return "subCategory must be null since '" + obj.category + "' has no subCategories";
                    }
                    return catTree.subCategories.includes(obj.subCategory) ? null : "subCategory '" + obj.subCategory + "' not available for category '" + obj.category + "'";
                }
                return null;
            });

        validator.propValidator("part", false)
            .typeOf("number")
            .maxValue(100);
        
        validator.propValidator("tags", false)
            .array()
            .notEmpty()
            .maxLength(10)
            .forEach(propValidator => {
                propValidator
                    .typeOf("string")
                    .notEmpty()
                    .maxLength(50);
            });

        return validator.getErrors()[0];
    }
}