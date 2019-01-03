import { Db, ObjectId } from "mongodb";
import { MediaEntity } from "../src/entities/MediaEntity";
import { SimpleTeacherEntity } from "../src/entities/SimpleTeacherEntity";
import { SimpleSeriesEntity } from "../src/entities/SimpleSeriesEntity";
import { TextEntity } from "../src/entities/TextEntity";
import { TeacherEntity } from "../src/entities/TeacherEntity";
import { SeriesEntity } from "../src/entities/SeriesEntity";

function randomNumber(maxValue: number){
    return Math.floor(Math.random() * maxValue)
}

export function createMediaEntity(params?: {teacher?: TeacherEntity, series?: SeriesEntity}): MediaEntity{
    let now = new Date();
    let mediaEntity = new MediaEntity();
    mediaEntity.teacher = new SimpleTeacherEntity();
    if (params && params.teacher){
        mediaEntity.teacher._id = params.teacher._id
        mediaEntity.teacher.firstName = params.teacher.firstName;
        mediaEntity.teacher.lastName = params.teacher.lastName;
        mediaEntity.teacher.fullName = params.teacher.fullName;
    } else {
        mediaEntity.teacher._id = new ObjectId()
        mediaEntity.teacher.firstName = "first #" + randomNumber(999).toString();
        mediaEntity.teacher.lastName = "last #" + randomNumber(999).toString();
        mediaEntity.teacher.fullName = "full #" + randomNumber(99999).toString();
    }
    mediaEntity.series = new SimpleSeriesEntity();
    if (params && params.series){
        mediaEntity.series._id = params.series._id;
        mediaEntity.series.title = params.series.title;
        mediaEntity.series.image = params.series.image;
        mediaEntity.series.imageSquare = params.series.imageSquare;
    } else {
        mediaEntity.series._id = new ObjectId()
        mediaEntity.series.title = "title #" + randomNumber(9999).toString();
        mediaEntity.series.image = "www.img.com/" + randomNumber(99999).toString();
        mediaEntity.series.imageSquare = "www.img.com/" + randomNumber(99999).toString();
    }
    mediaEntity.text = new TextEntity();

    mediaEntity.mediaCode = randomNumber(9999).toString();
    mediaEntity.dateRecorded = now;
    mediaEntity.title = "title " + randomNumber(9999);
    mediaEntity.category = "cat #" + randomNumber(9);
    mediaEntity.subCategory = "subcat #" + randomNumber(9);
    mediaEntity.part = 1

    return mediaEntity;
}

export async function insertMedia(db: Db, mediaEntity: MediaEntity){
    let dbResult = await db.collection<MediaEntity>("media").insertOne(mediaEntity);
}

export function getMediaByCode(db: Db, code: string): Promise<MediaEntity>{
    let filter: Partial<MediaEntity> = {"mediaCode": code};
    return db.collection<MediaEntity>("media").findOne(filter);
}


export function createTeacherEntity(): TeacherEntity{
    let now = new Date();
    let teacherEntity = new TeacherEntity();
    teacherEntity.firstName = "first #" + randomNumber(999).toString();
    teacherEntity.lastName = "last #" + randomNumber(999).toString();
    teacherEntity.fullName = "full #" + randomNumber(99999).toString();
    teacherEntity.bio = "I was created for no purpose other than testing # " + + randomNumber(999).toString();
    teacherEntity.imageUrl = "www.img.com/" + randomNumber(999).toString();

    return teacherEntity;
}

export async function insertTeacher(db: Db, teacherEntity: TeacherEntity){
    let dbResult = await db.collection<TeacherEntity>("teacher").insertOne(teacherEntity);
}

export function getTeacherById(db: Db, id: string): Promise<TeacherEntity>{
    let filter: Partial<TeacherEntity> = {"_id": new ObjectId(id)}
    return db.collection<TeacherEntity>("teacher").findOne(filter);
}

export function createSeriesEntity(): SeriesEntity{
    let now = new Date();
    let seriesEntity = new SeriesEntity();

    return seriesEntity;
}

export async function insertSeries(db: Db, seriesEntity: SeriesEntity){
    let dbResult = await db.collection<SeriesEntity>("series").insertOne(seriesEntity);
}

export function getSeriesById(db: Db, id: string): Promise<SeriesEntity>{
    let filter: Partial<SeriesEntity> = {"_id": new ObjectId(id)}
    return db.collection<SeriesEntity>("series").findOne(filter);
}