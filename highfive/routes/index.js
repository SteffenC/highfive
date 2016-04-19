var express = require('express');
var router = express.Router();
var db_functions = require('../db_logic/db.js')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/products/', function(req, res, next) {
  console.log("1");
  db_functions.findItems(function(itemsList){
    console.log(itemsList);
    res.json(itemsList);
  });
});

router.post('/products/', function(req, res) {
  var item = req;
  var status = saveItems(item);
  res.send(status);
});

module.exports = router;
