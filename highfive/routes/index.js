var express = require('express');
var router = express.Router();
var db_functions = require('../db_logic/db.js');
var auth = require('./auth.js');
var status = require('./errorHandling.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

/* Persist new product */
router.post('/products/', function(req, res) {
  auth.post(res, req, status.denied, db_functions.saveItems) ;
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
  auth.post(res, req, status.denied, db_functions.saveUser) ;
});

module.exports = router;
