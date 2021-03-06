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


//Root directory
app.get('/', function(req, res){
    res.redirect('/posts');
});

//Starting the server
app.listen(3000, function (){
  console.log('Server running on port 3000');
});