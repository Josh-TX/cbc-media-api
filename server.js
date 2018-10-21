const express        = require('express');
var MongoClient      = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
var db               = require('./config/db');

const app            = express();

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.atlasUrl, { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err)
  db = database.db("cbc-media-api")
  require('./app/routes')(app, db);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})