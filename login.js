var login = function(){
	for(var i = 0 ; i < formsData.length; ++i){
		document.querySelector(formsData[i].cssSelector).value = formsData[i].data;	
		console.log(formsData[i].data);
	}
	document.querySelector(loginButton).click();
}

login();