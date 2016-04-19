var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/production');

var itemsSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  price: Number,
  picture: String,
  state: String,
  endDate: String,
  location: String,
  owner_id: Number

})

var itemModel = mongoose.model("items", itemsSchema);
//module.exports = itemModel;

exports.findItems = function(callback){
  console.log("2");
  itemModel.find(function (error, items) {
    var itemsList = [];

    items.forEach(function(i) {
      itemsList.push({"title": i.title, "description": i.description});
    });
    callback(itemsList);
  });
}

function saveItems(item) {
   new itemModel(item).save(function(e){
     return 200;
   });

}
