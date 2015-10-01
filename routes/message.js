var db = require("../models");
var express = require("express");
var router = express.Router({mergeParams:true});
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");
var users = require("./users");

router.use('/:user_id/message', users);

router.get('/new',function(req,res){
  var receiver = req.params.user_id;
    res.render('messages/new', {receiver: receiver});
});

router.post('/', function(req,res){
  db.User.findById(req.session.id, function(err, sender){
    db.User.findById(req.params.user_id, function(err, receiver){
      db.Message.create(req.body.message, function (error, message){
        console.log("this is the receiver!", receiver.username)
        console.log("this is the sender!", sender.username)
        // console.log("this is the message!", message)
        message.sender = sender._id;
        message.receiver = receiver._id;
        sender.sentMessages.push(message);
        receiver.receivedMessages.push(message);
        receiver.save(function(err,rec){
          sender.save(function(err,send){
            message.save(function(err,message){
              console.log("THIS IS THE FINAL MESSAGE!", message)
              res.redirect('/');
            });
          });
        });
      });
    });
  });
});

router.get('/', function(req,res){
  db.User.findById(req.session.id).populate('receivedMessages sentMessages').exec(function(err, user){
    var options = {
      path: "sentMessages.receiver receivedMessages.sender",
      model: "User"
    };
    db.User.populate(user, options, function(err,innerUser){
      // console.log('the sender was', innerUser.sentMessages.receiver.username);
      res.render('messages/index', {user: user});
    });
  });
});

router.get('/:id', function(req, res){
  db.Message.findById(req.params.id).populate('sender').exec(function(error, message){
    res.render('messages/show', {message: message});
  });
});

router.delete('/:id', function(req, res){
  db.Message.findByIdAndRemove(req.params.id, function(error){
    res.redirect('/users/' +req.session.id + '/message');
  });
});






















module.exports = router;