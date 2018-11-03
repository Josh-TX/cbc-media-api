import { SimpleTeacherEntity } from "./SimpleTeacherEntity";
import { TextEntity } from "./TextEntity";
import { SimpleSeriesEntity } from "./SimpleSeriesEntity";
import { MediaFileEntity } from "./MediaFileEntity";

export class MediaEntity {
    mediaCode: string;
    dateRecorded: string;
    title: string;
    teacher: SimpleTeacherEntity;
    text: TextEntity;
    category: string;
    subCategory: string;
    series: SimpleSeriesEntity;
    part: number;
    audio: MediaFileEntity;
    video: MediaFileEntity
    mp3: string;
    mp4: string;
    vimeoId: string;
    youtubeId: string;
    slides: string;
    outline: string;
    duration: string; 
}