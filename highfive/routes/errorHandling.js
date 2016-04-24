exports.denied = function(res){
console.log(403);
}

exports.ok = function(res){
  res.sendStatus(200);
}
