var express            = require('express');
var auth               = require('./auth.js');
var status             = require('./errorHandling.js');
var db_functions       = require('../db_logic/db.js');
var crypto             = require("./crypto.js");
var userModel          = require("./user.js");
var facebookGrantModel = require("./facebookGrantModel.js");
var ticket             = require("./ticket.js");
var router             = express.Router();


/* GET / */
router.get('/', function (req, res, next) {});
router.post('/', function (req, res) {});

/**
* PRODUCTS
**/

/* Return all products */
router.get('/products/', function(req, res, next) {
  auth.get(res, req, status.denied, function(){
    db_functions.findItems(function(itemsList){
      res.json(itemsList);
    });
  })
});

/* Return single product */
router.get("/products/:id", function(req, res, next) {
  auth.get(res, req, status.denied, function(){
    db_functions.findItemByBy(req.params.id, function(item){
      res.send(item);
    })
  })
});

/* Persist new product */
router.post('/products/', function(req, res) {
  auth.post(res, req, status.denied, db_functions.saveItem);
});

/**
* USERS
**/

/* Return all users */
router.get('/users/', function(req, res, next) {
  db_functions.findUsers(function(usersList){
    res.json(usersList);
  });
});

/* Persist new user */
router.post('/users/', function(req, res) {
  auth.post(res, req, function(){
    res.sendStatus(403);
  },function(user) {
    userModel.validateModel(user, crypto.createHash, function(user) {
      db_functions.saveUser(user, function(e) {
        res.sendStatus(200);
        res.end();
      });
    });
  }) ;
});

/**
* TOKENS
**/

/* Request access_token */
router.post("/oauth/token", function(req, res) {
  console.log("Session: " + req.sessionID);
  auth.post(res, req, function(){
    res.sendStatus(403);
  }, function(token){
    res.send(token);
  }, auth.grantAccessToken)
})

/* Submit Facebook Access token */
router.post("/service/facebook", function(req, res) {
  req.body.sessionID = req.sessionID;
  // Attach access_token to body for further usage.
  req.body.access_token = req.headers.authorization;
  // Authorize the user by the provided access:_token.
  auth.userAuthorizedPost(res, req, function(){res.sendStatus(403)}, function(facebookGrant) {
    // Validate provided data.
    facebookGrantModel.validateModel(req.body, function(facebookGrant){
      // Save Facebook Access token for user.
      db_functions.saveFacebookGrant(facebookGrant, function(facebookGrant){
        res.send(200);
      })
    })
  })
})

/**
* RESOURCE
**/

router.post("/facebook/pictures/:userId", function(req, res) {
    
    // Attach sessionID, access_token, and user_id to body for further usage.
    req.body.sessionID    = req.sessionID;
    req.body.access_token = req.headers.authorization;
    req.body.user_id      = req.params.userId;

    // Validate access token
    auth.userAuthorizedPost(res, req, function(){res.sendStatus(403)}, function(user) {
      // validate RPT token
      auth.validateRpt(req.body,
        // onSuccess
        function(rpt){
          console.log("RPT success!");
        },
        // onFailure - trigger permission ticket generation (RS --> AS)
        function(rpt){
          // Find requested resource
          db_functions.findResource({"user_id": req.params.userId, "resource_uri": "/facebook/pictures"},function(resource){
            // Send ticket request to authorization server.
            if(resource) {
              resource.user_id = req.params.userId;
              ticket.requestTicket(resource, res);
            }else {
              res.sendStatus(404);
            }
          })
        })
    })
})



module.exports = router;
