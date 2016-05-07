var graph = require('fbgraph');

exports.getUserProfile = function(fbToken, success) {
  extendAccessToken(fbToken, function(){
    graph.post("/me/picture?access_token="+fbToken, wallPost, function(err, res) {
      console.log(res); // { id: xxxxx}
    });
  });
}

exports.validateFbAuth = function(res, req, success){

}

extendFacebookToken = function(token, success){
  graph.extendAccessToken({
      "access_token":   token
    , "client_id":      "1724357184474755"
    , "client_secret":  "4e235742e3cd01a6804360dd8094fd1b"
  }, function (err, facebookRes) {
    success(facebookRes);
  });
}
