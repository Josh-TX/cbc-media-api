import { Request, Response } from "express";
import * as express from "express";
import { Db } from "mongodb";
import { TeacherEntity } from "../entities/TeacherEntity";
import * as helpers from "../helpers/helpers";

import { Teacher } from "../models/Teacher";
import { CreateTeacherRequest } from "../models/CreateTeacherRequest";
import { UpdateTeacherRequest } from "../models/UpdateTeacherRequest";

export class TeacherRoute {
    db: Db

    constructor(router: express.Router, db: Db){
        this.db = db;
        router.get("/teacher/:id", this.getTeacherById.bind(this));
        router.post("/teacher", this.postTeacher.bind(this));
        router.put("/teacher/:id", this.updateTeacherById.bind(this));
        router.delete("/teacher/:id", this.deleteTeacherById.bind(this));
    }

    async getTeacherById(req: Request, res: Response){
        let objectId = helpers.tryParseObjectId(req.params.id);
        if (!objectId){
            res.status(400).send("failed to parse '" + req.params.id + "' into an ObjectId");
            return;
        }
        let filter: Partial<TeacherEntity> = {"_id": objectId}
        let entity: TeacherEntity = await this.db.collection("teacher").findOne(filter);
        if (entity == null){
            res.status(400).send("failed to find teacher for ObjectId " + req.params.id);
            return;
        }
        let teacher = new Teacher();
        
        teacher._id = entity._id.toHexString();
        teacher.firstName = entity.firstName;
        teacher.lastName = entity.lastName;
        teacher.fullName = entity.fullName;
        teacher.bio = entity.bio;
        teacher.imageUrl = entity.imageUrl;

        res.json(teacher);
    }

    async postTeacher(req: Request, res: Response){
        let request = new CreateTeacherRequest(req.body);
        let errorMessage = request.validate();
        if (errorMessage){
            res.status(400).send(errorMessage);
            return;
        }

        let teacher = new TeacherEntity();

        teacher.firstName = request.firstName;
        teacher.lastName = request.lastName;
        teacher.fullName = request.fullName;
        teacher.bio = request.bio;
        teacher.imageUrl = request.imageUrl;

        let dbResult = await this.db.collection("teacher").insertOne(teacher);
        res.send(dbResult.insertedId.toHexString());
    }

    async updateTeacherById(req: Request, res: Response){
        let objectId = helpers.tryParseObjectId(req.params.id);
        if (!objectId){
            res.status(400).send("failed to parse '" + req.params.id + "' into an ObjectId");
            return;
        }
        let request = new UpdateTeacherRequest(req.body);
        let errorMessage = request.validate();
        if (errorMessage){
            res.status(400).send(errorMessage);
            return;
        }
        let filter: Partial<TeacherEntity> = {"_id": objectId}
        let setProperties: Partial<TeacherEntity> = {};
        setProperties.firstName = request.firstName;
        setProperties.lastName = request.lastName;
        setProperties.fullName = request.fullName;
        setProperties.bio = request.bio;
        setProperties.imageUrl = request.imageUrl;

        await this.db.collection("teacher").updateOne(filter, {$set: setProperties});
        res.json();
    }
    
    async deleteTeacherById(req: Request, res: Response){
        let objectId = helpers.tryParseObjectId(req.params.id);
        if (!objectId){
            res.status(400).send("failed to parse '" + req.params.id + "' into an ObjectId");
            return;
        }
        let filter: Partial<TeacherEntity> = {"_id": objectId}
        let dbResult = await this.db.collection("teacher").deleteOne(filter);
        let statusCode = dbResult.deletedCount ? 200 : 204;
        res.send(statusCode);
    }
}