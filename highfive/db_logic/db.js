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

var usersSchema = new mongoose.Schema({
  id: Number,
  firstName: String,
  lastName: String,
  email: String,
  location: String,
  pwdHash: String,
  AuthType: String
})

var usersModel = mongoose.model("users", usersSchema);
//module.exports = itemModel;



exports.findItems = function(callback){
  itemModel.find(function (error, items) {
    var itemsList = [];
    items.forEach(function(i) {
      itemsList.push({"title": i.title, "description": i.description, "price": i.price, "picture": i.picture_path, "owner_er": i.owner_id});
    });
    callback(itemsList);
  });
}

exports.saveItem = function(item, callback) {
   new itemModel(item).save(function(e){
     console.log(e);
     callback(200);
   });
}

exports.findUsers = function(callback) {
  usersModel.find(function(error, users) {
    var usersList = [];
    users.forEach(function(i) {
      usersList.push({"id": i.id, "firstname": i.firstName, "lastname": i.lastName, "email": i.email, "location": i.location});
    });
    callback(usersList);
  });
}

exports.saveUser = function(user, callback) {
   new usersModel(user).save(function(e){
     callback(200);
   });
}
