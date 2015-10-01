var mongoose = require('mongoose');

mongoose.connect( process.env.MONGOLAB_URI || "mongodb://localhost/dog_park_app");
mongoose.set("debug", true);

module.exports.Message = require('./message');
module.exports.User = require('./user');
module.exports.Post = require('./post');
module.exports.Comment = require('./comment');