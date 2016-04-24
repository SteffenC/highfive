var db_functions = require('../db_logic/db.js')

exports.post = function(res, req, err, success){
  var stat = 0;
  if(req.headers.hasOwnProperty('authorization') && req.headers.authorization == "key") {
    success(req.body, function(){
      res.sendStatus(200);
    });
  }else {
    res.sendStatus(403);
  }
}
