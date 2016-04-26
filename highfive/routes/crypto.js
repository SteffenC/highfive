exports.hash = function(user, callback){
  var crypto = require('crypto');
  var salt = crypto.randomBytes(32).toString('hex');
  user.password += salt;
  user.salt = salt;
  user.password = crypto.createHash('sha256').update(user.password).digest('hex')

  console.log(user);
  callback(user);
}
