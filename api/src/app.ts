import * as express from "express";
import * as bodyParser from "body-parser";
import { MediaRoute } from './routes/media';
import config from './config';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import { MongoClient, Db } from "mongodb";
import ExpressPromiseRouter from "express-promise-router";


class App {

    public app: express.Application;

    constructor() {
        this.app = express();
    }

    async init(){
        this.app.use(bodyParser.json({limit: '500kb'})); 
        if (config.allowCors){
            this.app.use(this.allowCors);
        }
        let swaggerDoc = JSON.parse(fs.readFileSync(config.openApiFile).toString());
        this.app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
        this.app.use("/", express.static(config.staticDirectory));
        var url = `mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`;
        console.log("connecting too " + url)
        var client = await MongoClient.connect(url, {useNewUrlParser: true});
        var router = ExpressPromiseRouter();
        this.app.use("/", router);
        new MediaRoute(router, client.db(config.mongodb.db));
        router.use(this.handleErrors);

        this.app.listen(config.port, () => {
            console.log('listening on port ' + config.port);
        })
        
    }

    private allowCors(req: express.Request, res:express.Response, next: express.NextFunction) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    }

    private handleErrors(err: Error, req: express.Request, res:express.Response, next: express.NextFunction) {
        if (config.showErrors){
            res.status(500).send(err.stack);
        } else {
            res.status(500).send();
        }
    }
}

let application = new App();
application.init();
export default application;