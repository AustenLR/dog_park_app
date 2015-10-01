require('dotenv').load();
var db = require("../models");
var express = require("express");
var router = express.Router();
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");
var request = require('request');
var qs = require('querystring');  

router.get('/search', function(req,res){
  res.render('petfinder/search');
});



router.get('/',function(req,res){

  // url for petfinder
  var url = 'http://api.petfinder.com/pet.find';

  //grabbing the parameters for the search;
  var searchParameters ={
    key : process.env.PET_FINDER_API_KEY,
    animal : req.query.animal,
    breed : req.query.breed,
    size : req.query.size,
    sex : req.query.sex,
    age : req.query.age,
    location : req.query.zipCode,
    count: 24,
    format: 'json'
  };

  console.log(req.query.zipCode);

  // turning the paramters object into a query string
  var paramURL = qs.stringify(searchParameters);

  console.log(paramURL);

  // Adding the query string to the url
  var apiURL = url+'?'+paramURL;

  console.log(apiURL);

  request.get(apiURL,function(error, response, body){
    var bodyParsed = JSON.parse(body);
    var pets = bodyParsed.petfinder.pets.pet;
    res.render('petfinder/show', {pets: pets});
  });
});

//http://api.petfinder.com/pet.find?key=153ffed8b32c3e35c6b37b373389e913&location=94609&format=json



module.exports = router;