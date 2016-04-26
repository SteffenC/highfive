var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

mongoose.connect('mongodb://localhost/production');

var itemsSchema = new mongoose.Schema({
  _id: Object,
  title: String,
  description: String,
  category: String,
  price: Number,
  picture_path: String,
  state: String,
  endDate: String,
  location: String,
  owner_id: [{ type: Number, ref: 'Users' }]
})

var itemModel = mongoose.model("items", itemsSchema);
//module.exports = itemModel;

var usersSchema = new mongoose.Schema({
  id: Number,
  firstName: String,
  lastName: String,
  email: String,
  location: String,
  password: String,
  salt: String,
  AuthType: String
})

var usersModel = mongoose.model("users", usersSchema);
//module.exports = itemModel;

var oauthTokenSchema = new mongoose.Schema({
  token: String,
  user_id: String,
  expires: String
})

var oauthTokenModel = mongoose.model("oauthToken", oauthTokenSchema);

exports.findItems = function(callback){
  itemModel.find(function (error, items) {
    var itemsList = [];
    items.forEach(function(i) {
      itemsList.push({"title": i.title, "description": i.description, "price": i.price, "picture": i.picture_path, "owner_id": i.owner_id, "_id": i.id});
    });
    callback(itemsList);
  });
}

exports.findItemByBy = function(id, callback){
  itemModel.findOne( { _id: ObjectId(id)}, "title description price", function(err, obj){
      callback(obj);
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

exports.fetchSalt = function(user, callback) {
  console.log(user);
  usersModel.findOne(user, function(err, obj){
    console.log("hello");
    callback(err, obj);
  });
}

exports.saveUser = function(user, success) {
  console.log(user);
   new usersModel(user).save(function(e){
     success();
   });
}

exports.saveAuthToken = function(user, token, success) {
  new oauthTokenModel(token).save(function(e) {
    success();
  })
}

exports.findAuthToken = function(user, success) {
  oauthTokenModel.findOne(user, function(err, obj) {
    success(obj);
  })
}
