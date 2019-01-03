type ErrorContainer = {error: string};

export class Validator<T>{

    private obj: T;
    private errorContainers: ErrorContainer[];

    constructor(obj: T){
        this.obj = obj;
        this.errorContainers = [];
    }

    propValidator(key: string, isRequired: boolean) {
        let errorContainer: ErrorContainer = {error: null};
        this.errorContainers.push(errorContainer);
        let value = (<any>this.obj)[key];
        if (isRequired && value == null){
            errorContainer.error = key + " is required";
        }
        return new PropValidator(this.obj, errorContainer, key, value);
    }

    getErrors(): string[]{
        return this.errorContainers.map(z => z.error).filter(z => !!z);
    }
}

class PropValidator<T>{

    private obj: T;
    private key: string;
    private value: any;
    private errorContainer: ErrorContainer;
    private finished: boolean = false;
    

    constructor(obj: T, errorContainer: ErrorContainer, key: string, value: any){
        this.obj = obj;
        this.key = key;
        this.value = value;
        this.errorContainer = errorContainer;
        if (this.value == null){
            this.finished = true;
        }
    }

    typeOf(type: "string" | "number" | "boolean" | "symbol" | "object" | "function"): PropValidator<T>{
        if (!this.finished && typeof this.value != type){
            this.errorContainer.error = this.key + " must be typeof " + type;
            this.finished = true;
        }
        return this;
    }

    array(): PropValidator<T>{
        if (!this.finished && !Array.isArray(this.value)){
            this.errorContainer.error = this.key + " must be an array";
            this.finished = true;
        }
        return this;
    }

    notEmpty(): PropValidator<T>{
        if (!this.finished && !this.value.length){
            this.errorContainer.error = this.key + " must not be empty";
            this.finished = true;
        }
        return this;
    }

    minLength(length: number): PropValidator<T>{
        if (!this.finished && this.value.length < length){
            this.errorContainer.error = this.key + " must have a minimum length of " + length;
            this.finished = true;
        }
        return this;
    }

    maxLength(length: number): PropValidator<T>{
        if (!this.finished && this.value.length > length){
            this.errorContainer.error = this.key + " must have a maximum length of " + length;
            this.finished = true;
        }
        return this;
    }

    minValue(value: number): PropValidator<T>{
        if (!this.finished && this.value < value){
            this.errorContainer.error = this.key + " must have a minimum value of " + length;
            this.finished = true;
        }
        return this;
    }

    maxValue(value: number): PropValidator<T>{
        if (!this.finished && this.value > value){
            this.errorContainer.error = this.key + " must have a maximum value of " + length;
            this.finished = true;
        }
        return this;
    }

    objectId(): PropValidator<T>{
        if (!this.finished && !/^[a-f\d]{24}$/.test(this.value)){
            this.errorContainer.error = this.key + " must be a valid ObjectId";
            this.finished = true;
        }
        return this;
    }

    dateString(): PropValidator<T>{
        if (!this.finished && isNaN(Date.parse(this.value))){
            this.errorContainer.error = this.key + " must be a date";
            this.finished = true;
        }
        return this;
    }

    url(): PropValidator<T>{
        if (!this.finished && !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(this.value)){
            this.errorContainer.error = this.key + " must be a valid url";
            this.finished = true;
        }
        return this;
    }

    forEach(callback: (propValidator: PropValidator<any[]>) => void): PropValidator<T>{
        for (var i = 0; !this.finished && i < this.value.length; i++){
            let propValidator = new PropValidator(this.value, this.errorContainer, this.key + "[" + i + "]", this.value[i]);
            callback(propValidator);
            this.finished = !!this.errorContainer.error;
        }
        return this;
    }

    custom(customValidator: (obj: T) => string): PropValidator<T>{
        if (!this.finished){
            let message = customValidator(this.obj);
            if (message && typeof message == "string"){
                this.errorContainer.error = message;
                this.finished = true;
            }
        }
        return this;
    }
}