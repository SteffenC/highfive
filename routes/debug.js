const fs = require('fs');

exports.introspect = function(req, res) {
  fs.appendFile('/home/dev/server-out.json', "## Introspect RPT:\n", function (err) {});
  var obj = {};
  obj.backendRequest = req;
  obj.authorizationServerResponse = res;
  fs.appendFile('/home/dev/server-out.json', JSON.stringify(obj, null, 2) + "\n", function (err) {});
}
