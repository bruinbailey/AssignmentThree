var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.use('/v1', require('./lib/routes'));

function connectToMongo(url, db, cb) {
	var options = {
		useNewUrlParser: true
	};

	MongoClient.connect(url, options, function(err, client) {
		if (err) {
			console.log('Error connecting to Mongo');
			return cb(err);
		}
		console.log('Connected successfully to server');

		cb(null, client.db(db));
	});
}

connectToMongo('mongodb://localhost:27017', 'test', function(err, client) {
	if (err) {
		console.log(err);
		return;
	}
	app.locals.db = client;
	app.listen(8080, function() {
		console.log('Listening on 8080');
	});
});

