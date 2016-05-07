exports.validateModel = function(facebookToken, success){
	console.log("asdasdasd" + facebookToken);
	if(facebookToken.fb_access_token && facebookToken.access_token) {
		success(facebookToken);
	}

}
