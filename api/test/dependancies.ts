import * as express from "express";
import { MongoClient, Db } from "mongodb";
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as config from '../src/config.json';
import { CreateApp } from "../src/app";

export var app: express.Express;
export var db: Db;


before(async () => {
    var memoryServer = new MongoMemoryServer();
    var url = await memoryServer.getConnectionString();
    var mongoClient = await MongoClient.connect(url, {useNewUrlParser: true});
    app = CreateApp(config, mongoClient);
    db = mongoClient.db(config.mongodb.db);
})