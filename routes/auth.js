var status       = require('./errorHandling.js');
var db_functions = require('../db_logic/db.js');
var users        = require('./user.js');
var crypto       = require('./crypto.js');

exports.post = function(res, req, err, success, next){
  authenticateClient(req, err, function(status){
    if(status) {
      if(next) {
        req.body.sessionID = req.sessionID;
        next(req.body, err, success);
      }else {
        success(req.body);
      }
    }else {
      err();
    }
  })
}

exports.get = function(res, req, err, success){
  if(authenticateClient(req, err, success)) {
    success(req.body);
  }
}

exports.userAuthorizedPost = function(res, req, err, success) {
  // Standard POST validating (authenticate client)
  exports.post(res, req, err, function(body){
    // Extract user from provided access_token
    validateAccessTokenForUser(body, function(userId){
      // Add the extracted user_id to the object for later usage.
      body.user_id = userId;
      success(body);
    });

  })
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
            token.userId = user._id;
            success(token);
          }else {
            createToken(body, user, success, exports.grantAccessToken);
          }
        });
      })
    });
  }
}

validateAccessTokenForUser = function(body, success){
   //db_functions.findAuthUser({"access_token": body.token, "session_id": body.sessionID}, function(userId){
   //  success(userId);
   //})  

   //test:
  db_functions.findAuthUser({"access_token": body.access_token}, function(userId){
    success(userId);
  })
}

authenticateClient = function(req, err, success){

  // GET API KEY
  if(req.headers.hasOwnProperty('authorization') && req.headers.authorization == "key") {
    return success(req.body);
  }else if(req.headers.hasOwnProperty('authorization')) {
    db_functions.findAuthToken({"access_token": req.headers.authorization}, function(token) {
      if(token) {
        success(req.body);
      }else {
        err();
      }
    })
  }else {
    err();
  }
}

authenticateUser = function(user, body, success) {
  crypto.validateHash(body, user.salt, function(challenge){
    if(challenge == user.password) {
      success();
    }else {
      success(false);
    }
  })
}


createToken = function(body, user, success, next) {
  var crypto = require('crypto');
  var token = {
    "access_token": crypto.randomBytes(32).toString('hex'),
    "session_id": body.sessionID,
    "expires_in": "2017",
    "token_type": "bearer",
    "user_id": user._id
  };

  db_functions.saveAuthToken(user, token, function(token){
    next(body, null, success);
  })
}
