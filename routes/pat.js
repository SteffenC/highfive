var request = require('request');
var pat = require('../model/pat.js');
var debug = require('./debug.js');

exports.introspect = function(rpt, userId, success, err) {
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
     if (!error && response.statusCode == 200){
       exports.sendRequest(response.body.access_token, rpt, userId, success, err);
     }
  });
}

exports.sendRequest = function(token, rpt, userId, success, err){
  request({
      url: 'https://139.59.128.218:3000/introspect',
      method: 'POST',
      json: true,
      headers: {'authorization': token},
      body: {"token": rpt, "requesting_user_id": userId}
  }, function (error, response, body){
     if (!error && response.statusCode == 200) {
       debug.introspect({"headers": {'authorization': token, "body": {"token": rpt, "requesting_user_id": userId}}}, body);
       pat.validate(body,
          function(){
            success(body);
          }, err
       );
     }
  });

}
