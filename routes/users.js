var db = require("../models");
var express = require("express");
var router = express.Router();
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");

router.use(loginMiddleware);

//NEED TO ADD DELETE TO HERE OR ACCESS.JS

//all users - index
router.get('/', function(req,res){
  db.User.find({}).sort({ username: 1 }).exec(function(err, users){
    res.render('users/index', {users: users});
  });
});

//user's profile page with their posts - show
router.get('/:id', function(req, res){
  db.User.findById(req.params.id).populate('posts upvotes pack').exec(function(err, user){
    res.render('users/show', {user: user});
  });
});

//edit user page - edit NEED TO ADD MIDDLEWARE
router.get('/:id/edit', function(req,res){
  db.User.findById(req.params.id,function(err, user){
    res.render('users/edit', {user: user});
  });
});

//updating the user
router.put('/:id', function(req,res){
  db.User.findByIdAndUpdate(req.params.id, req.body.user, function(){
    res.redirect('/users');
  });
});

//deleting a user
router.delete('/:id', function(req,res){
  console.log('remove');
  db.User.findByIdAndRemove(req.params.id, function(){
    res.redirect('/signup');
  });
});

//joining a pack
router.put('/:id/joinpack', function(req, res){
  db.User.findById(req.session.id, function(err,curUser){
    db.User.findById(req.params.id, function(err, dogjoining){
      curUser.pack.push(dogjoining);
      curUser.save();
    });
  });
  res.redirect('/users/'+ res.locals.currentUser.id);
});

//leaving a pack
router.put('/:id/leavepack', function(req, res){
  db.User.findById(req.session.id, function(err,curUser){
    db.User.findById(req.params.id, function(err, dogleaving){
      var x = curUser.upvotes.indexOf(dogleaving._id);
      user.upvotes.splice(y,1);
      curUser.save();
    });
  });
  res.redirect('/users/'+ res.locals.currentUser.id);
});








// New/post would be to access as well as delete ??? fri 3:35

module.exports = router;
