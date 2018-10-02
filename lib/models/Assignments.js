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
    dueDate: {
        type: Date,
        required: true
    },
    openDate: {
        type: Date,
        default: Date.now
    },
    closeDate: {
        type: Date,
        required: true
    }
});



module.exports = Assignments;