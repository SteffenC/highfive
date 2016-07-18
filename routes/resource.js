var request      = require('request');
var db_functions = require('../db_logic/db.js');

exports.register = function(resource, success) {
  request({
      url: 'https://139.59.128.218:3000/oauth/token',
      method: 'POST',
      json: true,
      headers: {'authorization': 'key'},
      body: {
        "grant_type": "password",
        "client_id": "rs",
        "secret": "rs"
      }
  }, function (error, response, body){
     if (!error && response.statusCode == 200)
      exports.sendRequest(response.body.access_token, resource, success)
  });
}

exports.sendRequest = function(token, resource, success){
  console.log("sendRequest fire! with token: " + JSON.stringify(token));
  request({
      url: 'https://139.59.128.218:3000/register/resource',
      method: 'POST',
      json: true,
      headers: {'authorization': token},
      body:
        {"resource_uri": resource.resource_uri,
         "user_id": resource.user_id
        }
  }, function (error, response, body){
     if (!error && response.statusCode == 200)
       success(body);
  });

}


exports.getResource = function(resource, success) {
  db_functions.findResource(resource, function(resource) {
    db_functions.findUser({"_id": resource.user_id}, function(user) {
      var r = {};
      r.firstname  = user.firstname;
      r.lastname   = user.lastname;
      r.location   = user.location;
      success(r);
    })
  });  
}