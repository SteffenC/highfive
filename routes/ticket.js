var request = require('request');

exports.requestTicket = function(resource, res) {
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
      sendRequest(response.body.access_token, resource, res)
  });
}

sendRequest = function(token, resource, res){
  request({
      url: 'https://139.59.128.218:3000/register/ticket',
      method: 'POST',
      json: true,
      headers: {'authorization': token},
      body:
        {"resource_set_id": resource.resource_id,
         "user_id": resource.user_id,
         "scope": "read"
        }
  }, function (error, response, body){
     if (!error && response.statusCode == 200)
       res.json(body);
  });

}
