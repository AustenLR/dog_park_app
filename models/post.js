var mongoose = require('mongoose');
var Comment = require('./comment');
var User = require('./user');
var date = new Date();
var datePost = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2,2);

mongoose.set('debug', true);

var postSchema = new mongoose.Schema ({
                    title: {type: String, required: true},
                    picture: String,
                    date: {type: String, default: datePost},
                    dateCompare: {
                      default: Date.now,
                      type: Date
                    },
                    upvotes: [{ 
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"                      
                    }],
                    comments: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Comment"
                    }],
                    username: String,
                    user: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"
                    }
                  });

postSchema.pre('remove', function(next) {
  Comment.remove({post: this._id}).exec();
  next();
});

var Post = mongoose.model("Post", postSchema);

// var thing = Post.create; //Friday 2:19 What is this code???

module.exports = Post;