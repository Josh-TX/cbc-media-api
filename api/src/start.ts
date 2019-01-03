import * as config from './config.json';
import { MongoClient } from "mongodb";
import { CreateApp } from "./app";

async function startServer(){
    var url = `mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`;
    console.log("connecting to " + url)
    var client = await MongoClient.connect(url, {useNewUrlParser: true});
    var app = CreateApp(config, client);
    app.listen(config.port, () => {
        console.log('listening on port ' + config.port);
    })
}

startServer();