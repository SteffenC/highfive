var status       = require('./errorHandling.js');
var db_functions = require('../db_logic/db.js');
var users        = require('./user.js');
var crypto       = require('./crypto.js');

exports.post = function(res, req, err, success, next){
  if(authenticateClient(req))
    if(next) {
      req.body.sessionID = req.sessionID;
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

exports.grantAccessToken = function(body, err, success) {
  // Get required OAuth2 fields from HTTP
  if(body.grant_type == "password" && body.email && body.password) {
    // Find user by email
    users.findUser({"email": body.email}, function(user){
      // Validate password from DB with password from HTTP params
      authenticateUser(user, body, function() {
        // Find Access token from current session_id or create a new one.
        db_functions.findAuthToken({"session_id": body.sessionID}, function(token) {
          if(token) {
            success(token);
          }else {
            createToken(body, user, success, exports.grantAccessToken);
          }
        });
      })
    });

  }
}

authenticateClient = function(req){
  // GET API KEY
  if(req.headers.hasOwnProperty('authorization') && req.headers.authorization == "key") {
    return true;
  }else {
    return false;
  }
}

authenticateUser = function(user, body, success) {
  crypto.validateHash(body, user.salt, function(challenge){
    if(challenge == user.password) {
      console.log("AuthenticateUser - TRUE");
      success();
    }else {
      console.log("AuthenticateUser - FALSE");
    }
  })
}


createToken = function(body, user, success, next) {
  var token = {
    "access_token": user.email,
    "session_id": body.sessionID,
    "expires_in": "2017",
    "token_type": "bearer"
  };

  db_functions.saveAuthToken(user, token, function(token){
    next(body, null, success);
  })
}
