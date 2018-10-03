var mongoose = require('mongoose');
var User = require('Users')

var Schema = mongoose.Schema;

var assignSchema = new Schema({
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



module.exports = Assignments;