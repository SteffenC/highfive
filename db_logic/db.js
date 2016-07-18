var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
mongoose.connect('mongodb://localhost/production');

var itemsSchema = new mongoose.Schema({
  _id: String,
  title: String,
  description: String,
  category: String,
  price: Number,
  picture_path: String,
  state: String,
  endDate: String,
  location: String,
  owner_id: String
})

var itemModel = mongoose.model("items", itemsSchema);
//module.exports = itemModel;

var usersSchema = new mongoose.Schema({
  id: Number,
  firstname: String,
  lastname: String,
  email: String,
  location: String,
  password: String,
  salt: String,
  authtype: String
})

var usersModel = mongoose.model("users", usersSchema);
//module.exports = itemModel;

var oauthTokenSchema = new mongoose.Schema({
  access_token: String,
  session_id: String,
  expires_in: String,
  token_type: String,
  user_id: String
})

var oauthTokenModel = mongoose.model("oauthTokens", oauthTokenSchema);

var facebookGrantSchema = new mongoose.Schema({
  user_id: String,
  fb_user_id: String,
  fb_access_token: String
})
var facebookGrantModel = mongoose.model("facebookGrant", facebookGrantSchema);

var resourceSchema = new mongoose.Schema({
  resource_id: String,
  resource_uri: String,
  user_id: String
})
var resourceModel = mongoose.model("resource", resourceSchema);

exports.findItems = function(callback){
  itemModel.find(function (error, items) {
    var itemsList = [];
    items.forEach(function(i) {
      itemsList.push({"title": i.title, "description": i.description, "price": i.price, "picture": i.picture_path, "owner_id": i.owner_id, "_id": i.id});
    });
    callback(itemsList);
  });
}

exports.findItemById = function(id, callback){
  itemModel.findOne( { "_id": id}, function(err, obj){
    if(obj) {
     callback(obj);
    }
  });
}

exports.saveItem = function(item, callback) {
  var product = {};
  product._id = ObjectId();
  product.title = item.title;
  product.description = item.description;
  product.price = item.price;
  product.picture_path = item.picture_path;
  product.state = item.state;
  product.endDate = item.endDate;
  product.location = item.location;
  product.owner_id = item.user_id;
  new itemModel(product).save(function(e, obj){
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
  usersModel.findOne(user, function(err, obj){
    if(!err)
      callback(err, obj.salt);
  });
}

exports.findUser = function(user, callback) {
  usersModel.findOne(user, function(err, obj){
    if(obj)
      callback(obj);
  });
}

exports.saveUser = function(user, success) {
   new usersModel(user).save(function(e, obj){
     success(obj);
   });
}

exports.saveAuthToken = function(user, token, success) {
  oauthTokenModel.find({access_token: token.access_token}).remove(null);
  new oauthTokenModel(token).save(function(e) {
    success(e);
  })
}

exports.findAuthToken = function(sessionID, success) {
  oauthTokenModel.findOne(sessionID, function(err, obj) {
    if(obj) {
      success({
        "access_token": obj.access_token,
        "expires_in": obj.expires_in,
        "token_type": obj.token_type
      });
    }else {
      success(false);
    }
  })
}

exports.findAuthUser = function(sessionID, success) {
  oauthTokenModel.findOne(sessionID, function(err, obj) {
    if(obj)
      success(obj.user_id);
    else
      success(false);
  })
}

exports.findFacebookGrant = function(facebookGrant, callback) {
  facebookGrantModel.findOne(facebookGrant, function(err, obj){
    if(obj) {
      callback(obj);
    }
  });
}

exports.saveFacebookGrant = function(facebookGrant, success) {
   new facebookGrantModel(facebookGrant).save(function(e){
     success(facebookGrant);
   });
}

exports.findResource = function(resource, success) {
  resourceModel.findOne(resource, function(err, obj) {
    if(obj)
      success(obj);
  })
}
