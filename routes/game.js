var db = require("../models");
var express = require("express");
var router = express.Router({mergeParams:true});
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");
var posts = require("./posts");

router.get('/', function(req,res){
  res.render('game/index');
});

module.exports = router;