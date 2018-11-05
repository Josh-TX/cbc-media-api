import { Request, Response } from "express";
import * as express from "express";
import { Db, ObjectID } from "mongodb";
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
        const code = req.params.code;
        let entity: MediaEntity = await this.db.collection("media").findOne({"mediaCode": code});
        if (entity == null){
            res.status(400).send("failed to find media for mediaCode " + code);
            return;
        }
        let media = new Media();
        media.teacher = new SimpleTeacher();
        media.teacher._id = entity.teacher._id;
        media.teacher.firstName = entity.teacher.firstName;
        media.teacher.lastName = entity.teacher.lastName;
        media.teacher.fullName = entity.teacher.fullName;
        media.series = new SimpleSeries();
        media.series._id = entity.series._id;
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
            this.db.collection("teacher").findOne({ '_id': new ObjectID(request.teacherId) }),
            this.db.collection("series").findOne({ '_id': new ObjectID(request.seriesId) })
        ]);
        let teacher = <TeacherEntity>results[0];
        if (teacher == null){
            res.status(400).send("failed to find teacher for _id " + request.teacherId);
            return;
        }
        let series = <SeriesEntity>results[1];
        if (series == null){
            res.status(400).send("failed to find series for _id " + request.seriesId);
            return;
        }
        let now = new Date();
        let dateRecorded = new Date(request.dateRecorded);
        let media = new MediaEntity();
        media.teacher = new SimpleTeacher();
        media.teacher._id = teacher._id;
        media.teacher.firstName = teacher.firstName;
        media.teacher.lastName = teacher.lastName;
        media.teacher.fullName = teacher.fullName;
        media.series = new SimpleSeries();
        media.series._id = series._id;
        media.series.title = series.title;
        media.series.image = series.image;
        media.series.imageSquare = series.imageSquare;
        media.text = new TextEntity();
        //todo: convert text string to TextEntity

        media.mediaCode = helpers.getMediaCode(dateRecorded, request.category);
        media.dateRecorded = dateRecorded;
        media.title = request.title;
        media.category = request.category;
        media.subCategory = request.subCategory;
        media.part = request.part;

        let dbResult = await this.db.collection("media").insertOne(media);
        res.send(media.mediaCode);
    }

    async updateMediaByCode(req: Request, res: Response){
        const code = req.params.code;
        const request = new UpdateMediaRequest(req.body);
        let errorMessage = request.validate();
        if (errorMessage){
            res.status(400).send(errorMessage);
            return;
        }
        let dbResult = await this.db.collection("media").updateOne({"mediaCode": code}, {$set: request});
        res.json(dbResult);
    }
    
    async deleteMediaByCode(req: Request, res: Response){
        const code = req.params.code;
        let dbResult = await this.db.collection("media").deleteOne({"mediaCode": code});
        res.send(200);
    }
}