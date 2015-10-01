var db = require("../models");

var loginHelpers = function (req, res, next) {
  req.login = function (user) {
    req.session.id = user._id;
  };

  req.logout = function () {
    req.session.id = null;
    req.user  = null;
  };

  if(!req.session){
    res.locals.currentUser = undefined;
    next();
  }
  else {
    db.User.findById(req.session.id, function(err,user){ 
      res.locals.currentUser = user;
      next();
    });
  }
};

module.exports = loginHelpers;