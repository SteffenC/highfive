var graph = require('fbgraph');
var db_functions = require('../db_logic/db.js');

exports.getResource = function(userId, success) {
  db_functions.findFacebookGrant({"user_id": userId}, function(grant){
    picture(grant.fb_access_token, success);
  })
}


picture = function(fbToken, success) {
  extendAccessToken(fbToken, function(){
    graph.get("me/picture?width=400&height=400&access_token="+fbToken, function(err, res) {
      success(res); // { id: xxxxx}
    });
  });
}

extendAccessToken = function(token, success){
  graph.extendAccessToken({
      "access_token":   token
    , "client_id":      "1724357184474755"
    , "client_secret":  "4e235742e3cd01a6804360dd8094fd1b"
  }, function (err, facebookRes) {
    success(facebookRes);
  });
}
