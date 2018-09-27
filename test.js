var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;
var Users = require('./lib/models/Users');
var dbName = 'test';
var url = 'mongodb://localhost:27017';

var options = {
	useNewUrlParser: true
};

MongoClient.connect(url, options, function(err, client) {
	if (err) {
		console.log('Error connecting to Mongo');
		return;
	}
	console.log('Connected successfully to server');

	var db = client.db(dbName);

	var user = new Users(db, {
			uid: 01189998819991197253,
			name: 'foo bar',
			enrollments: ['P422']
		});

	user.save(function(err) {
		if (err) {
			console.log(err);
			return err;
		}

		Users.all(db, function(err, users) {
				usersJSON = JSON.stringify(_.map(users, function(u) {
						return u.valueOf();
					}), 0, 2);
				console.log(usersJSON);

				var newU = new Users(db, {uid: users[0].data.uid});
				newU.get(function(err, user) {
						if (err) {
							console.log(err);
							return;
						}
						console.log(user.toString());
						//users[0].delete(function(err) {
							client.close();
						//});
					});
			});
	});
});


