var _ = require('lodash');
var express = require('express');
var router = express.Router();
var Users = require('./models/Users');

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
		var mewIser = new Users(newUserInfo);
		newUser.save()
			.catch(err => {
				res.status(500);
				res.json(err);
			})
			.then(docs => {
				res.status(200);
				res.json(docs);
			});
	});

router.route('/users/:userId')
	.get(function(req, res) {
		Users.findOne({uid: req.params.userID}).exec()
		.catch(err => {
			res.status(400);
			res.json(err);
		})
		.then(err => {
			res.status(200);
			res.json(docs);
		});
	})
	.put(function(req, res) {
		var newUserInfo = req.body;

		if(req.params.userID !== String(req.body.uid)) {
			res.status(400);
			return res.json("Your user IDs don't match.");
		}
		Users.update({uid: req.body.uid},
		{$set: req.body},
		{upsert: true})
		.catch(err => {
			res.status(500);
			res.json(err);
		})
		.then(docs => {
			res.status(200);
			res.json(docs);
		});
	});

router.route('/assignments')
	.get(function(req, res){
		// return list of all assignments in system
		// have search option to limit assignments to one class
	})
	.post(function(req, res){
		// create new assignment usiing JSON body of req
		// verify all info correct, else return appropriate status and error
	});

router.route('/assignments/class/:className/:assignmentName')
	.get(function(req, res){
		// return single assignment document representing given assignment

	})
	.delete(function(req, res){
		// remove the given assignment
	})
	.put(function(req, res){
		// update assignment using body
		// verify info correct, else return appropriate status and error msg
	});


	module.exports = router;