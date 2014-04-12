var websitedata = [
	{ 
		reg: "/facebook.com/",
		idfield: "#email",
		pwfield: "#pass",
		submit: "#loginbutton" 
	},
	{	
		reg:"/google.com/",
		idfield: "#Email",
		pwfield: "#Passwd",
		submit: "#signIn"
	}
]

function setUpListener(id, pw, submit){
	var idField = document.querySelector(id);
	var pwField = document.querySelector(pw);	

	var submitButton = document.querySelector(submit);
	submitButton.addEventListener("click", saveFields, false);
}


function setUpListeners(){
	var location = window.location.href;
	console.log(location);
	alert(location);
	for(var i = 0; i < websitedata.length; ++i){
		var regexp = new RegExp(websitedata[i].reg);
		var result = regexp.test(location);
		if(result){
			setUpListener(websitedata[i].id, websitedata[i].pw, websitedata[i].submit);
		}
	}
	return;
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	chrome.tabs.executeScript(tabId, {code:"setUpListeners();"}, null);
	console.log("added listener");
});


