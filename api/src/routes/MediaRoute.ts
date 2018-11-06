import { Request, Response } from "express";
import * as express from "express";
import { Db } from "mongodb";
import { UpdateMediaRequest } from "../models/UpdateMediaRequest";
import { CreateMediaRequest } from "../models/CreateMediaRequest";
import { Media } from "../models/Media";
import { SimpleTeacher } from "../models/SimpleTeacher";
import { TeacherEntity } from "../entities/TeacherEntity";
import { SeriesEntity } from "../entities/SeriesEntity";
import { SimpleSeries } from "../models/SimpleSeries";
import * as helpers from "../helpers/helpers";
import { MediaEntity } from "../entities/MediaEntity";
import { TextEntity } from "../entities/TextEntity";
import { MediaFile } from "../models/MediaFile";
import { SimpleTeacherEntity } from "../entities/SimpleTeacherEntity";
import { SimpleSeriesEntity }from "../entities/SimpleSeriesEntity";

export class MediaRoute {
    db: Db

    constructor(router: express.Router, db: Db){
        this.db = db;
        router.get("/media/:code", this.getMediaByCode.bind(this));
        router.post("/media", this.postMedia.bind(this));
        router.put("/media/:code", this.updateMediaByCode.bind(this));
        router.delete("/media/:code", this.deleteMediaByCode.bind(this));
    }

    async getMediaByCode(req: Request, res: Response){
        let code = req.params.code;
        let filter: Partial<MediaEntity> = {"mediaCode": code};
        let entity: MediaEntity = await this.db.collection("media").findOne(filter);
        if (entity == null){
            res.status(400).send("failed to find media for mediaCode " + code);
            return;
        }
        let media = new Media();
        media.teacher = new SimpleTeacher();
        media.teacher._id = entity.teacher._id.toHexString();
        media.teacher.firstName = entity.teacher.firstName;
        media.teacher.lastName = entity.teacher.lastName;
        media.teacher.fullName = entity.teacher.fullName;
        media.series = new SimpleSeries();
        media.series._id = entity.series._id.toHexString();
        media.series.title = entity.series.title;
        media.series.image = entity.series.image;
        media.series.imageSquare = entity.series.imageSquare;
        if (entity.audio){
            media.audio = new MediaFile
            media.audio.duration = entity.audio.duration;
            media.audio.fileSize = entity.audio.fileSize;
            media.audio.url = entity.audio.url;
        }
        if (entity.video){
            media.video = new MediaFile
            media.video.duration = entity.video.duration;
            media.video.fileSize = entity.video.fileSize;
            media.video.url = entity.video.url;
        }
        //todo: convert TextEntity to text string
        media.text = "";//entity.text;

        media.mediaCode = entity.mediaCode;
        media.dateRecorded = entity.dateRecorded.toString();
        media.title = entity.title;
        media.category = entity.category;
        media.subCategory = entity.subCategory;
        media.part = entity.part;
        media.vimeoId = entity.vimeoId;
        media.youtubeId = entity.youtubeId;
        media.slidesUrl = entity.slidesUrl;
        media.outlineUrl = entity.outlineUrl;
        media.transcriptUrl = entity.transcriptUrl;
        res.json(media);
    }

    async postMedia(req: Request, res: Response){
        let request = new CreateMediaRequest(req.body);
        let errorMessage = request.validate();
        if (errorMessage){
            res.status(400).send(errorMessage);
            return;
        }

        let results = await Promise.all([
            this.getTeacherById(request.teacherId),
            this.getSeriesById(request.seriesId)
        ]);
        let teacherResult = results[0];
        if (typeof teacherResult == "string"){
            res.status(400).send(teacherResult);
            return;
        }
        let seriesResult = results[1];
        if (typeof seriesResult == "string"){
            res.status(400).send(seriesResult);
            return;
        }

        let dateRecorded = new Date(request.dateRecorded);
        let mediaEntity = new MediaEntity();
        mediaEntity.teacher = new SimpleTeacherEntity();
        mediaEntity.teacher._id = teacherResult._id;
        mediaEntity.teacher.firstName = teacherResult.firstName;
        mediaEntity.teacher.lastName = teacherResult.lastName;
        mediaEntity.teacher.fullName = teacherResult.fullName;
        mediaEntity.series = new SimpleSeriesEntity();
        mediaEntity.series._id = seriesResult._id;
        mediaEntity.series.title = seriesResult.title;
        mediaEntity.series.image = seriesResult.image;
        mediaEntity.series.imageSquare = seriesResult.imageSquare;
        mediaEntity.text = new TextEntity();
        //todo: convert text string to TextEntity

        mediaEntity.mediaCode = helpers.getMediaCode(dateRecorded, request.category);
        mediaEntity.dateRecorded = dateRecorded;
        mediaEntity.title = request.title;
        mediaEntity.category = request.category;
        mediaEntity.subCategory = request.subCategory;
        mediaEntity.part = request.part;

        let dbResult = await this.db.collection("media").insertOne(mediaEntity);
        res.send(mediaEntity.mediaCode);
    }

    async updateMediaByCode(req: Request, res: Response){
        let code = req.params.code;
        let request = new UpdateMediaRequest(req.body);
        let errorMessage = request.validate();
        if (errorMessage){
            res.status(400).send(errorMessage);
            return;
        }
        let filter: Partial<MediaEntity> = {"mediaCode": code};
        let setProperties: Partial<MediaEntity> = {};

        if (request.teacherId){
            let teacherResult = await this.getTeacherById(request.teacherId);
            if (typeof teacherResult == "string"){
                res.status(400).send(teacherResult);
                return;
            }
            setProperties.teacher = new SimpleTeacherEntity();
            setProperties.teacher._id = teacherResult._id;
            setProperties.teacher.firstName = teacherResult.firstName;
            setProperties.teacher.lastName = teacherResult.lastName;
            setProperties.teacher.fullName = teacherResult.fullName;
        }
        if (request.seriesId){
            let seriesResult = await this.getSeriesById(request.seriesId);
            if (typeof seriesResult == "string"){
                res.status(400).send(seriesResult);
                return;
            }
            setProperties.series = new SimpleSeriesEntity();
            setProperties.series._id = seriesResult._id;
            setProperties.series.title = seriesResult.title;
            setProperties.series.image = seriesResult.image;
            setProperties.series.imageSquare = seriesResult.imageSquare;
        }
        setProperties.title = request.title;
        //todo: allow updated TextEntity
        //setProperties.text = request.text


        let dbResult = await this.db.collection("media").updateOne(filter, {$set: setProperties});
        res.json(dbResult);
    }
    
    async deleteMediaByCode(req: Request, res: Response){
        let code = req.params.code;
        let filter: Partial<MediaEntity> = {"mediaCode": code};
        let dbResult = await this.db.collection("media").deleteOne(filter);
        let statusCode = dbResult.deletedCount ? 200 : 204;
        res.send(statusCode);
    }

    private async getTeacherById(id: string): Promise<TeacherEntity | string>{
        let teacherObjectId = helpers.tryParseObjectId(id);
        if (!teacherObjectId){
            return "failed to parse teacherId '" +  id + "' into an ObjectId";
        }
        let teacherFilter: Partial<TeacherEntity> = { '_id': teacherObjectId };
        return this.db.collection("teacher").findOne(teacherFilter).then(teacherEntity => {
            if (!teacherEntity){
                return "failed to find teacher for _id " + id;
            }
            return teacherEntity;
        });
    }

    private async getSeriesById(id: string): Promise<SeriesEntity | string>{
        let seriesObjectId = helpers.tryParseObjectId(id);
        if (!seriesObjectId){
            return "failed to parse seriesId '" +  id + "' into an ObjectId";
        }
        let seriesFilter: Partial<SeriesEntity> = { '_id': seriesObjectId };
        return this.db.collection("teacher").findOne(seriesFilter).then(seriesEntity => {
            if (!seriesEntity){
                return "failed to find series for _id " + id;
            }
            return seriesEntity;
        });
    }
}