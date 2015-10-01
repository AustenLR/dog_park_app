var mongoose = require('mongoose');
var User = require('./user');
var date = new Date();
var datePost = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2,2);

mongoose.set('debug', true);

var messageSchema = new mongoose.Schema ({
                    title: {type: String, required: true},
                    body: String,
                    date: {type: String, default: datePost},
                    sender: { 
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"                      
                    },
                    receiver: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"
                    },
                  });


var Message = mongoose.model("Message", messageSchema);

module.exports = Message;