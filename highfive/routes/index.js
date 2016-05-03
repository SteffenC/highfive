var express       = require('express');
var auth          = require('./auth.js');
var status        = require('./errorHandling.js');
var db_functions  = require('../db_logic/db.js');
var crypto        = require("./crypto.js");
var userModel     = require("./user.js");
var router        = express.Router();


/* GET / */
router.get('/', function(req, res, next) {});
router.post('/', function(req, res) {});

/**
* PRODUCTS
**/

/* Return all products */
router.get('/products/', function(req, res, next) {
  db_functions.findItems(function(itemsList){
    res.json(itemsList);
  });
});

/* Return single product */
router.get("/products/:id", function(req, res, next) {
  db_functions.findItemByBy(req.params.id, function(item){
    res.send(item);
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
  auth.post(res, req, status.denied, function(user) {
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
    res.sendStatus(500);
  }, function(token){
    res.send(token);
  }, auth.grantAccessToken)
})

module.exports = router;
