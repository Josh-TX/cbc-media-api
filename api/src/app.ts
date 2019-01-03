import * as express from "express";
import * as bodyParser from "body-parser";
import { MediaRoute } from './routes/MediaRoute';
import { TeacherRoute } from "./routes/TeacherRoute";
import * as swaggerUi from 'swagger-ui-express';
import { MongoClient, Db } from "mongodb";
import ExpressPromiseRouter from "express-promise-router";
import { IConfig } from "./interfaces/IConfig";
import * as openapi from "./openapi.json";


export function CreateApp(
    config: IConfig, 
    mongoClient: MongoClient
): express.Express {
    var app = express();
    app.use(bodyParser.json({limit: '500kb'})); 
    if (config.allowCors){
        app.use(allowCors);
    }
    app.use('/api', swaggerUi.serve, swaggerUi.setup(openapi));
    app.use("/", express.static(config.staticDirectory));
    var router = ExpressPromiseRouter();
    app.use("/", router);
    new MediaRoute(router, mongoClient.db(config.mongodb.db));
    new TeacherRoute(router, mongoClient.db(config.mongodb.db));
    if (config.showErrors){
        router.use(handleErrorsWithMessage);
    } else {
        router.use(handleErrors);
    }
    return app
}

function allowCors(req: express.Request, res:express.Response, next: express.NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
}

function handleErrorsWithMessage(err: Error, req: express.Request, res:express.Response, next: express.NextFunction) {
    res.status(500).send(err.stack);
}

function handleErrors(err: Error, req: express.Request, res:express.Response, next: express.NextFunction) {
    res.status(500).send();
}