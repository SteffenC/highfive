var status       = require('./errorHandling.js');
var db_functions = require('../db_logic/db.js');
var users = require('./user.js');

exports.post = function(res, req, err, success, next){
  if(authenticateClient(req))
  if(next) {
    next(req.body, err, success);
  }else {
    success(req.body);
  }
  else
    err(res);
}

exports.strictPost = function(res, req, err, success){
  if(authenticateClient(req) && authorizeClient(req)){
    success(req.body);
  }

}

authenticateClient = function(req){
  if(req.headers.hasOwnProperty('authorization') && req.headers.authorization == "key") {
    return true;
  }else {
    return false;
  }
}


exports.grantAccessToken = function(body, err, success) {
  if(body.grant_type == "password" && body.email && body.password) {
    users.findUser({"email": body.email}, function(user){
      if(user) {
        console.log(user);
        db_functions.findAuthToken({"user_id": user._id}, function(token) {
          if(token) {
            success(token);
          }else {
            createToken(user, success, exports.grantAccessToken);
          }
        });
      }else {
        err();
      }
    });
  }
}

createToken = function(user, success, next) {
  var token = {
    "token": "thisisanawesometoken!",
    "user_id": user._id,
    "expires": "2017"
  };

  db_functions.saveAuthToken(user, token, function(token){
    next(user, success);
  })
}
