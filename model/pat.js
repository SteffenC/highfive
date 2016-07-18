exports.validate = function(state, success, err){
  if(state.active == 1 || state.active == "1") {
    if(state.exp) {
      if(sate.exp < Math.round(+new Date() / 1000)) // UMA dictates the expiration time to set as a UNIX timestamp (measured in seconds).
        success(state);
    }else {
      success(state);
    }
  }else {
    err();
  } 
    
}

exports.validateRpt = function(body, err, success) {
	if(body.rpt) {
		success(body.rpt);
	}else if(body.token){
		success(body.token);
	}else {
    err();
  }
}