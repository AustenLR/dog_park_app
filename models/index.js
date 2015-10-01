var mongoose = require('mongoose');

mongoose.connect( process.env.MONGOLAB_URI || "mongodb://localhost/YOUR_DB_NAME");
mongoose.set("debug", true);

module.exports.Message = require('./message');
module.exports.User = require('./user');
module.exports.Post = require('./post');
module.exports.Comment = require('./comment');