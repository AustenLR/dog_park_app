var db = require("../models");
var express = require("express");
var router = express.Router();
var routeMiddleware = require("../middleware/routeHelper");
var loginMiddleware = require("../middleware/loginHelper");


var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');
require('dotenv').load();


router.get('/new', function(req,res){
  res.render('yelp/new');
});

router.get('/',function(req,res){

  var distanceInMiles = parseInt(req.query.distance);
  var distance = distanceInMiles/ 0.0006213712;
  var sort = req.query.sort;


  var searchParameters = {
    location: req.query.zipCode,
    sort: sort,
    term: req.query.search,
    limit: 15,
    radius_filter: distance //distance in meters about 8 miles 
  };

  //type of request used to get the signature
  var httpMethod = 'GET';

  // url for yelp
  var url = 'http://api.yelp.com/v2/search';

  //required parameters
  var requiredParameters = {
    oauth_consumer_key : process.env.CONSUMER_KEY, 
    oauth_token : process.env.TOKEN,
    oauth_nonce : n(),
    oauth_timestamp : n().toString().substr(0,10),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0'
  };

  var parameters = _.assign(searchParameters, requiredParameters);

  var consumerSecret = process.env.CONSUMER_SECRET ; 
  var tokenSecret = process.env.TOKEN_SECRET; 

  //Call to Yelp's Oauth 1.0a server, and it returns a signature
  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

  //Adding signature to the paramters
  parameters.oauth_signature = signature;

  // turning the paramters object into a query string 
  var paramURL = qs.stringify(parameters);

  // Adding the query string to the url
  var apiURL = url+'?'+paramURL;

  //Making the API call to yelp
  request(apiURL, function(error, response, body){
    var bodyParsed = JSON.parse(body);
    var businesses = bodyParsed.businesses;
    res.render('yelp/show', {businesses: businesses});
  });

});


module.exports = router;