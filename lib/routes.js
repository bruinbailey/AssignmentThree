var _ = require('lodash');
var express = require('express');
var router = express.Router();
var Users = require('./models/Users');
var Assign = require('./models/Assignments');

router.route('/users')
	.get(function(req, res) {
		var query = Users.find();
		if (req.query && req.query.role) {
			query = query.byRole(req.query.role);
		}
		query.exec()
			.catch(err => {
				res.status(500);
				res.json(err);
			})
			.then(docs => {
					res.status(200);
					res.json(docs);
				});
	})
	.post(function(req, res) {
		var newUserInfo = req.body;
		var newUser = new Users(newUserInfo);
		newUser.save()
			.catch(err => {
				res.status(500);
				res.json(err);
			})
			.then(doc => {
				res.status(200);
				res.json(doc);
			});
	});

router.route('/users/:userId')
	.get(function(req, res) {
		Users.findOne({uid: req.params.userId}).exec()
			.catch(err => {
				res.status(404);
				res.json(err);
			})
			.then(doc => {
				res.status(200);
				res.json(doc);
			})
	})
	.put(function(req, res) {

		if (req.params.userId !== String(req.body.uid)) {
			res.status(400);
			return res.json("Your user IDs don't match.");
		}

		Users.findOne().byUID(req.body.uid)
			.exec()
			.catch(err => (500, {error: err}))
			.then(doc => {
				if (doc) {
					doc.set(req.body);
					return doc.save()
						.catch(err => res.json(400, {error: err}))
						.then(doc => res.json(200, doc));
				}
				var u = new Users(req.body);
				u.save()
					.catch(err => res.json(400, {error: err}))
					.then(doc => res.json(200, doc));
			});
	});

router.route('/assignments')
	.get(function(req, res){
		var query = Assign.find();
		if (req.query && req.query.class) {
			query = query.byClass(req.query.class);
		}
		query.exec()
			.catch(err => {
				res.status(500);
				res.json(err);
			})
			.then(docs => {
					res.status(200);
					res.json(docs);
				});
	})
	.post(function(req, res){
		var newAssignInfo = req.body;
		var newAssign = new Assign(newAssignInfo);
		newAssign.save()
			.catch(err => {
				res.status(500);
				res.json(err);
			})
			.then(doc => {
				res.status(200);
				res.json(doc);
			});
	});

router.route('/assignments/class/:className/:assignmentName')
	.get(function(req, res){
		Assign.findOne({class: req.params.className})
			.select(req.params.assignmentName)
			.exec()
				.catch(err => {
					res.status(404);
					res.json(err);
				})
				.then(doc => {
					res.status(200);
					res.json(doc);
				})

	})
	.put(function(req, res){
		// update assignment using body
		// verify info correct, else return appropriate status and error msg
	});


	module.exports = router;