var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var roleValidator = function(role) {
	return role === 'studen' || role === 'instructor';
};

var usersSchema = mongoose.Schema({
	uid: {
		type: String,
		require: true,
		index: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	role: {
		type: String,
		default: 'student',
		match: /(student|instructor)/
	},
	passwordHash: String,
	DOB: Date,
	enrollments:[String]
});

usersSchema.virtual('password')
	.set(function(password){
		this.passwordHash = bcrypt.hashSync(password, 10);
	});

usersSchema.methods.checkPassword = function(password){
	if (!this.passwordHash) return false;
	return (bcrypt.compareSync(password, this.passwordHash));
};

usersSchema.query.byRole = function(role){
	return this.where({role: role});
};

var Users2 = mongoose.model('User2', usersSchema);

module.exports = Users2;