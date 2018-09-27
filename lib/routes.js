var _ = require('lodash');
var express = require('express');
var router = express.Router();
var Users = require('./models/Users');

router.route('/users')
	.get(function(req, res) {
		var options = {};
		var db = req.app.locals.db;

		if (req.query && req.query.role) {
			options.role = req.query.role;
		}

		Users.all(db, options, function(err, users) {
			if (err) {
				res.status(500);
				res.json(err);
				return;
			}

			res.status(200);
			users = _.map(users, function(u) { return u.valueOf(); });
			res.json(users);
		});
	})
	.post(function(req, res) {
		var newUserInfo = req.body;
		var db = req.app.locals.db;

		var newUser = new Users(db, newUserInfo);
		newUser.save(function(err) {
				if (err) {
					res.status(400);
					return res.json(err);
				}

				res.status(200);
				res.json(newUser.valueOf());
			});
	});

router.route('/users/:userId')
	.get(function(req, res) {
		var db = req.app.locals.db;
		var user = new Users(db, {uid: req.params.userId});
		user.get(function(err, user) {
				if (err) {
					res.status(404);
					return res.json(err);
				}

				res.status(200);
				res.json(user.valueOf());
			});
	})
	.put(function(req, res) {
		var newUserInfo = req.body;
		var db = req.app.locals.db;

		if (req.params.userId !== String(req.body.uid)) {
			res.status(400);
			return res.json("Your user IDs don't match.");
		}

		var newUser = new Users(db, newUserInfo);
		newUser.save(function(err) {
				if (err) {
					res.status(400);
					return res.json(err);
				}

				res.status(200);
				res.json(newUser.valueOf());
			});
	});

module.exports = router;
