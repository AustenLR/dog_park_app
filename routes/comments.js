var db = require("../models");
var express = require("express");
var router = express.Router({mergeParams:true});
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");
var posts = require("./posts");

router.use('/:post_id/comments', posts); //?? is this prepending
router.use(loginMiddleware);

//Posting a comment (no comment page because the form will be on the show page)
router.post('/', function(req, res){
  db.Comment.create(req.body.comment, function(err, comment){
    comment.post = req.params.post_id;
    comment.save();
    db.Post.findById(req.params.post_id).populate('user').exec(function(err, post){
      post.comments.push(comment);
      db.User.findById(req.session.id, function(err, user){
      comment.user = user.username;
      comment.save();    
      });
      post.save();
    });
  });
  res.redirect('/posts/'+ req.params.post_id);
});

//Rendering the Edit Page
router.get('/:id/edit',function(req,res){
  db.Comment.findById(req.params.id, function(err, comment){
    res.render ('comments/edit', {comment: comment});
  });
});

//Editing the comment
router.put('/:id', function(req,res){
  db.Comment.findByIdAndUpdate(req.params.id, req.body.comment, function(err, comment){
    res.redirect('/posts/'+ req.params.post_id);
  });
});

//Deleting a comment
router.delete('/:id', function(req,res){ 
  db.Comment.findById(req.params.id).exec(function(err,comment){
    var postId = comment.post; //to go back to that post after deleting comment
    db.Comment.findByIdAndRemove(req.params.id, function(){
      res.redirect('/posts/'+ postId);
    });
  });
});

module.exports = router;









