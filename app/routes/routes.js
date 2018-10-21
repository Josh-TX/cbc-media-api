// Reusable varable to get an object by ID
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

  // MEDIA CREATE SINGLE
  // Create a new media entry
  app.post('/media', (req, res) => {

    const mediaPostProperties = { 
      title: req.body.title, 
      teacher: req.body.teacher 
      // More properties will go here in the future.
    };

    db.collection('media').insertOne(mediaProperties, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  // MEDIA GET SINGLE
  // Get a previously existing media entry by id
  app.get('/media/:id', (req, res) => {
  	const id = req.params.id;
    const filter = { '_id': new ObjectID(id) };
    db.collection('media').findOne(filter, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });

  // MEDIA UPDATE SINGLE
  // Update a previously existing media entry by id
  app.put('/media/:id', (req, res) => {
    const id = req.params.id;
    const filter = { '_id': new ObjectID(id) };

    const mediaUpdateProperties = { 
      title: req.body.title, 
      teacher: req.body.teacher 
      // More properties will go here in the future.
    };

    db.collection('media').updateOne(filter, {$set: mediaUpdateProperties}, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(mediaUpdateProperties);
      } 
    });
  });

  // MEDIA DELETE SINGLE
  // Delete a previously existing media entry by id
  app.delete('/media/:id', (req, res) => {
    const id = req.params.id;
    const filter = { '_id': new ObjectID(id) };
    db.collection('media').deleteOne(filter, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Media item ' + id + ' has been deleted.');
      } 
    });
  });
};