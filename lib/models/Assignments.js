var _ = require('lodash');
var bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectId;

var collection = 'assignments';

function Assignments(db, data) {
    this.coll = db.collection(collection);

     this.data = {};

    this.data.name = data.name || 'assign3';
    this.data.class = data.class || 'WebEnt';
    this.data.descrip = data.descrip || 'Server REST API';
    this.data.maxPoints = data.maxPoints || '100';
    this.data.subType = data.subType || 0;
}

Assignments.prototype = {
    get: function(callback) {
        var self = this;
        if (!self.data.class){
            return callback('Cannot get assignment no class was specified');
        }
        self.coll.aggregate([
            {$match:{
                class: self.data.class
            }}
        ],
        function(err, cursor) {
            if (err) return callback(err);
            // do something to return assignments for class
            // or assignment for user in class?
            
        });
    },

    save: function(callback) {
        var self = this;
        var errs = [],
            data = this.data;
        delete data._id;
        // do some input validation here

        self.coll.find({
            class: data.class
        }, function(err, cursor) {
            // do some stuff to update assignments for class
        });
    },
};

module.exports = Assignments;