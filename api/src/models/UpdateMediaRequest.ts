export class UpdateMediaRequest{
    title?: string;
    teacher?: string;
    text?: string;
    series?: string;
    category?: string;
    class?: string;
    constructor(body: any){
        this.title = body.title;
        this.teacher = body.teacher;
        this.text = body.text;
        this.series = body.series;
        this.category = body.category;
        this.class = body.class;
    }
}