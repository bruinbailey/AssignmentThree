var _ = require('lodash');
var bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectId;

var collection = 'assignments';

function Assignments(db, data) {
    this.coll = db.collection(collection);

     this.data = {};

    this.data.name = data.name || 'assignOne';
    this.data.class = data.class || 'WebDev';
    this.data.descrip = data.descrip || 'Web Development';
    this.data.maxPoints = data.maxPoints || '100';
    this.data.subType = data.subType || 1;
}

Assignments.prototype = {
    get: function(callback) {
        var self = this;
        if (!self.data.class || !self.data.name){
            return callback('No Class or Assignment specified');
        }
    },
};