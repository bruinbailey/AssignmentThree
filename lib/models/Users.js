var _ = require('lodash');
var bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectId;

var collection = 'users';

function Users(db, data) {
	this.coll = db.collection(collection);

	this.data = {};

	// we don't really want to represent _id, but we can use it to see if we hit the DB
	if (data._id)
		this._id = data._id;

	this.data.uid = String(data.uid) || undefined;
	this.data.name = data.name || 'fool';
	this.data.role = data.role || 'student';
	this.data.DOB = data.DOB || new Date('1972/01/01');
	this.data.passwordHash = data.passwordHash || undefined;
	this.data.enrollments = data.enrollments || [];
}

// All instance methods
Users.prototype = {

	setPassword: function(password) {
		this.data.passwordHash = bcrypt.hashSync(password, 10);
	},

	checkPassword: function(password) {
		if (!this.data.passwordHash) return false;
		return (bcrypt.compareSync(password, this.data.passwordHash));
	},

	// Hydrate a Users object if given a UID
	get: function(callback) {
		var self = this;
		if (!self.data.uid) {
			return callback('No UID provided');
		}
		self.coll.aggregate([
			{$match:{
				uid: self.data.uid
			}}
		],
		function(err, cursor) {
			if (err) return callback(err);

			cursor.toArray(function(err, documents) {
				if (err) return callback(err);
				if (documents.length !== 1) return callback('Got != one user!' + documents.length);

				self.data = documents[0];
				self._id = self.data._id;
				self.data._id = undefined;

				return callback(null, self);
			});
		});
	},

	// Save a User to the database
	save: function(callback) {
		var self = this;
		var errs = [];
		var data = this.data;
		delete data._id; // cannot update the _id field!

		// Should perform verification of all fields and return callback(error) if something fails.
		if (!data.uid)
			errs.push('User does not have a uid');
		if (!(data.DOB instanceof Date))
			errs.push('DOB is not a date');
		if (data.role != 'student' && data.role != 'instructor')
			errs.push('role must be one of [\'student\', \'instructor\']');

		if (errs.length > 0)
			return callback(errs);

		self.coll.find({
					uid: data.uid
			}, function(err, cursor) {
				cursor.count(function(err, count) {
					if (count > 0) {
						self.coll.updateOne({uid: data.uid},
							{$set: data}, function(err, result) {
								return callback(err);
							});
					} else {
						self.coll.insertOne(data, function(err, result) {
								return callback(err);
							});
					}
				});
			});
	},

	delete: function(callback) {
		var uid = this.data.uid;
		if (!uid) return callback('No UID given.');
		this.coll.deleteOne({uid: uid}, callback);
	},

	toString: function() {
		return JSON.stringify(this.data, 0, 2);
	},

	valueOf: function() {
		return this.data;
	}
};

// Here's a custom query. It's a static method!
Users.all = function(db, options, callback)  {
	var coll = db.collection(collection);
	if (!callback) {
		callback = options;
		options = {};
	}

	var pipeline = [];

	if (options.role && (options.role === 'student' || options.role === 'instructor')) {
		pipeline.push(
			{$match:{
				role: options.role
			}});
	}

	coll.aggregate(pipeline,
		function(err, cursor) {
			if (err) return callback(err);

			cursor.toArray(function(err, documents) {
				if (err) return callback(err);

				var students = _.map(documents, function(doc) {
					return new Users(db, doc);
				});

				return callback(null, students);
			});
		});
};

module.exports = Users;
