

var websitedata = [
	{ 
		website: "*.facebook.com",
		id: "email",
		pw: "pass",
		submit: "loginbutton"	
	},
	{

	}
]

function setUpListener(id, pw, submit){
	var idField = getElementById(id);
	var pwField = getElementById(pw);	

	var submitButton = getElementById(submit);
	submitButton.addEventListener("click", saveFields, false);
}


function setUpListeners(){
	var location = window.location.href;
}
