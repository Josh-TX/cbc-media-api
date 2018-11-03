import { SimpleSeries } from "./SimpleSeries";
import { MediaFile } from "./MediaFile";
import { SimpleTeacher } from "./SimpleTeacherEntity";

export class Media {
    mediaCode: string;
    dateRecorded: string;
    title: string;
    teacher: SimpleTeacher;
    text: string;
    category: string;
    subCategory: string;
    series: SimpleSeries;
    part: number;
    audio: MediaFile;
    video: MediaFile
    mp3: string;
    mp4: string;
    vimeoId: string;
    youtubeId: string;
    slides: string;
    outline: string;
    duration: string;
}