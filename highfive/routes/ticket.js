var request = require('request');

exports.requestTicket = function(resource, res) {
  request({
      url: 'http://139.59.128.218:15432/register/permission',
      method: 'POST',
      json: true,
      headers: {'authorization': 'key'},
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
