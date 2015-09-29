var db = require("../models");
var express = require("express");
var router = express.Router();
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");

router.use(loginMiddleware);

//Login Page w/ Middleware
router.get('/login', function(req,res){
  res.render('users/login');
});

//Authenticating when logging in 
router.post("/login", function (req, res) {
  db.User.authenticate(req.body.user, function (err, user) {
    console.log(err);
    if (!err && user !== null) {
      req.login(user);
      console.log('authenticate');
      res.redirect("/posts");
    } else {
      //add something if there is an error
      res.render("users/login");
    }
  });
});

//Signup Page
router.get('/signup', function(req,res){
  res.render('users/signup');
});

//Creating a new User
router.post('/signup', function(req,res){
  db.User.create(req.body.user, function(err, user){
    console.log(err);
    if (user){
      req.login(user);
      res.redirect('/posts');      
    } else {
      //Fri 3:50 Add something about being unsuccessful
      res.render('users/login');
    }
  });
});

//Logging out 
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/login");
});

module.exports = router;







