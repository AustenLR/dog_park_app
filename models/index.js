var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/dog_park_app");
mongoose.set("debug", true);

module.exports.User = require('./user');
module.exports.Post = require('./post');
module.exports.Comment = require('./comment');