var express            = require('express');
var auth               = require('./auth.js');
var status             = require('./errorHandling.js');
var db_functions       = require('../db_logic/db.js');
var crypto             = require("./crypto.js");
var userModel          = require("./user.js");
var facebookGrantModel = require("./facebookGrantModel.js");
var ticket             = require("./ticket.js");
var pat                = require('./pat.js');
var patModel           = require('../model/pat.js');
var fbAuth             = require('./fbauth.js');
var resource           = require('./resource.js');
var router             = express.Router();
var debug              = require('./debug.js');

/* GET / (Should point to API documentation) */
router.get('/', function (req, res, next) {});
router.post('/', function (req, res) {});

/**
* PRODUCTS!
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
    db_functions.findItemById(req.params.id, function(item){
      res.send(item);
    })
  })
});

/* Persist new product */
router.post('/products/', function(req, res) {
  req.body.sessionID    = req.sessionID;
  req.body.access_token = req.headers.authorization;
  auth.userAuthorizedPost(res, req, status.denied, function(user) {
    req.body.owner_id = user.user_id;
    db_functions.saveItem(req.body, function(){
      res.sendStatus(200);
    })
  })
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

/* Persist new user and associate a new basic resource to the user */
router.post('/users/', function(req, res) {
  auth.post(res, req, function(){
    res.sendStatus(403);
  },function(user) {
    userModel.validateModel(user, crypto.createHash, function(user) {
      db_functions.saveUser(user, function(e) {
        resource.register({"resource_uri": "/resource/basic", "user_id": e._id}, function(s){
          res.send(s);
        });
      });
    });
  }) ;
});

/**
* TOKENS
**/

/* Request access_token */
router.post("/oauth/token", function(req, res) {
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
        resource.register({"resource_uri": "/facebook/picture", "user_id": facebookGrant.user_id}, function(s){
          res.send(s);
        });
      })
    })
  })
})

/**
* RESOURCE
**/


/* Request pictures from facebook */
router.post("/:userId/resource/picture", function(req, res) {

    // Attach sessionID, access_token, and user_id to body for further usage.
  req.body.sessionID    = req.sessionID;
  req.body.access_token = req.headers.authorization;
  req.body.user_id      = req.params.userId;

  // Validate access token
  auth.userAuthorizedPost(res, req, function(){res.sendStatus(403)}, function(user) {
    patModel.validateRpt(req.body,
      function(rpt){
        // Find requested resource
        db_functions.findResource({"user_id": req.params.userId, "resource_uri": "/facebook/picture"},function(resource){
        // Send ticket request to authorization server.
          if(resource) {
            resource.user_id = user.user_id;
            ticket.requestTicket(resource, res);
          }else {
            res.sendStatus(404);
          }
        })
      },
      function(rpt){
        pat.introspect(rpt, req.body.user_id, function(stat){
          fbAuth.getResource(req.params.userId, function(resource){
            res.send(resource);
          })
        },
        function(){
          res.sendStatus(403);
        })
      })
  })
})

router.post('/:userId/resource/basic', function(req, res) {

  // Attach sessionID, access_token, and user_id to body for further usage.
  req.body.sessionID    = req.sessionID;
  req.body.access_token = req.headers.authorization;
  req.body.user_id      = req.params.userId;

  // Validate access token
  auth.userAuthorizedPost(res, req, function(){res.sendStatus(403)}, function(user) {
    patModel.validateRpt(req.body,
      function(rpt){
        // Find requested resource
        db_functions.findResource({"user_id": req.params.userId, "resource_uri": "/resource/basic"},function(resource){
        // Send ticket request to authorization server.
          if(resource) {
            resource.user_id = user.user_id;
            ticket.requestTicket(resource, res);
          }else {
            res.sendStatus(404);
          }
        })
      },
      function(rpt){
        pat.introspect(rpt, req.body.user_id, function(stat){
          resource.getResource({"resource_uri": "/resource/basic", "user_id": req.params.userId}, function(resource) {
            res.send(resource);
          })
        },
        function(){
          res.sendStatus(403);
        })
      })
  })
})
module.exports = router;
