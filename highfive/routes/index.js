var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/production');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var itemsSchema =  new mongoose.Schema({
  title: String
})

var item = mongoose.model("items", itemsSchema);
module.exports = item;
router.get('/products/', function(req, res, next) {

  item.find({"id": 1}, function (error, items) {
    var itemsMap = {};

    items.forEach(function(i) {
      itemsMap[i._id] = i;
    });

    res.send(itemsMap);
  });

});

module.exports = router;
