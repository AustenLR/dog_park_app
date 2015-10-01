var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    session = require("cookie-session"),
    db = require('./models'),
    loginMiddleware = require("./middleware/loginHelper"),
    routeMiddleware = require("./middleware/routeHelper"),
    usersRoutes = require("./routes/users"),
    postsRoutes = require("./routes/posts"),
    commentsRoutes = require("./routes/comments"),
    accessRoutes = require("./routes/access");
    searchRoutes = require("./routes/search");
    petfinderRoutes = require("./routes/petfinder");
    messageRoutes = require("./routes/message");
    require('dotenv').load();

//API call for Yelp
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();  
var request = require('request');  
var qs = require('querystring');  
var _ = require('lodash');

app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(loginMiddleware);

app.use(session({
  maxAge: 3600000,
  secret: 'kingsutro',
  name: "hot cookie"
}));

//Routes for the router
app.use('/', accessRoutes);
app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/posts/:post_id/comments', commentsRoutes);
app.use('/search', searchRoutes);
app.use('/petfinder', petfinderRoutes);
app.use('/users/:user_id/message', messageRoutes);


//Root directory
app.get('/', function(req, res){
    res.redirect('/posts');
});

//Starting the server
app.listen(process.env.PORT || 3000, function (){
  console.log('Server running');
});