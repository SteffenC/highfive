var express       = require('express');
var auth          = require('./auth.js');
var status        = require('./errorHandling.js');
var db_functions  = require('../db_logic/db.js');
var crypto        = require("./crypto.js");
var userModel     = require("./user.js");
var router        = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

});
router.post('/', function(req, res) {
});

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
  console.log(req.headers);
  console.log(req.body);
  auth.post(res, req, status.denied, function(user) {
    userModel.validateModel(user, crypto.hash, function(user) {
      db_functions.saveUser(user, function(e) {
        res.sendStatus(200);
        res.end();
      });
    });
  }) ;
});


router.post("/oauth/token", function(req, res) {
  auth.post(res, req, function(){
    status.denied(res);
  }, function(token){
    res.json({"access_token": token});
  }, auth.grantAccessToken)
})

module.exports = router;
