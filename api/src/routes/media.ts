import { Request, Response } from "express";
import * as express from "express";
import { Db, ObjectID } from "mongodb";
import { UpdateMediaRequest } from "../models/UpdateMediaRequest";

export class MediaRoute {
    db: Db

    constructor(router: express.Router, db: Db){
        this.db = db;
        router.get("/media/:id", this.getMediaById.bind(this));
        router.put("/media/:id", this.updateById.bind(this));
        router.delete("/media/:id", this.updateById.bind(this));
    }

    async getMediaById(req: Request, res: Response){
        const id = req.params.id;
        try {
            var objectId = new ObjectID(id);
        } catch(e){
            res.status(400).send(`unable to parse objectID from parameter '${id}'`);
            return;
        }
        const filter = { '_id': new ObjectID(id) };
        let dbResult = await this.db.collection("media").findOne(filter);
        res.json(dbResult);
    }

    async updateById(req: Request, res: Response){
        const id = req.params.id;
        try {
            var objectId = new ObjectID(id);
        } catch(e){
            res.status(400).send(`unable to parse objectID from parameter '${id}'`);
            return;
        }
        const request = new UpdateMediaRequest(req.body);
        const filter = { '_id': new ObjectID(id) };
        let dbResult = await this.db.collection("media").updateOne(filter, {$set: request});
        res.json(dbResult);
    }
    
    async deleteMediaById(req: Request, res: Response){
        const id = req.params.id;
        try {
            var objectId = new ObjectID(id);
        } catch(e){
            res.status(400).send(`unable to parse objectID from parameter '${id}'`);
            return;
        }
        const filter = { '_id': new ObjectID(id) };
        let dbResult = await this.db.collection("media").deleteOne(filter);
        res.send(200);
    }
}