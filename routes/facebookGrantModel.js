exports.validateModel = function(facebookToken, success){
	if(facebookToken.fb_access_token && facebookToken.access_token) {
		success(facebookToken);
	}

}
