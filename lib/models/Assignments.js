var mongoose = require('mongoose');

var assignSchema = mongoose.Schema({
    class: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    maxPoints: {
        type: Number,
        min: 1,
        required: true
    },
    subType: {
        ext: String,
        match: /(none|docx|zip|pdf)/
    },
    dueDate: Date,
    openDate: {
        type: Date,
        default: Date.now
    },
    closeDate: Date
});

assignSchema.query.byClass = function(class) {
	return this.where({class: class});
};

var Assignments = mongoose.model('Assignments', assignSchema);

module.exports = Assignments;