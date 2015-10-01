var db = require("../models");
var express = require("express");
var router = express.Router();
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");

router.use(loginMiddleware);

//Home page of Posts - Index
router.get('/', function(req, res){
  db.Post.find({}).populate('user').exec(function(err, posts){
    res.render('posts/index', {posts: posts});
  });
});

//New Post Page 
  //will identify the user posting by the loginhelper local storage current user
router.get('/new', routeMiddleware.ensureLoggedIn, function(req, res){
  res.render('posts/new');
});

//Rendering a single post
router.get('/:id', function(req, res){
  db.Post.findById(req.params.id).populate('comments user').exec(function(err, post){
    res.render('posts/show', {post:post});
  });
});

//Rendering the edit post page
router.get('/:id/edit', function(req, res){
  db.Post.findById(req.params.id, function(err, post){
    res.render('posts/edit', {post: post});
  });
});

//Posting a New post
router.post('/', routeMiddleware.ensureLoggedIn, function(req, res){
  db.User.findById(req.session.id, function(err,user){
    db.Post.create(req.body.post, function(err, post){
      post.user = user._id;
      post.username= user.username;
      user.posts.push(post);
      post.save();
      user.save();
    });
  });
  res.redirect('/posts');
});


//Upvoting a Post
router.put('/:id/upvote', function(req, res){
  db.User.findById(req.session.id, function(err,user){
    db.Post.findById(req.params.id, function(err, post){
      post.upvotes.push(user);
      user.upvotes.push(post);
      post.save();
      user.save();
      console.log(user);
      console.log(post);
      console.log(post.upvotesNumber);
    });
  });
  res.redirect('/posts/'+ req.params.id);
});

//Removing Upvote
router.put('/:id/downvote', function(req, res){
  db.User.findById(req.session.id, function(err,user){
    db.Post.findById(req.params.id, function(err, post){
      var x = post.upvotes.indexOf(user._id);
      post.upvotes.splice(x,1);
      var y = user.upvotes.indexOf(post._id);
      user.upvotes.splice(y,1);
      post.save();
      user.save();
      console.log(user);
      console.log(post);
    });
  });
  res.redirect('/posts/'+ req.params.id);
});


//Editing a Post
router.put('/:id', function(req, res){
  db.Post.findByIdAndUpdate(req.params.id, req.body.post, function(){
    res.redirect('/posts/' + req.params.id);
  });
});

//deleting a post
router.delete('/:id', function(req, res){
  db.Post.findById(req.params.id).exec(function(err, post){
    var userId = post.user; //need this to redirect back to that users profile page
    db.Post.findByIdAndRemove(req.params.id, function(){
      res.redirect('/users/'+ userId);
    });
  }); 
});

module.exports = router;










