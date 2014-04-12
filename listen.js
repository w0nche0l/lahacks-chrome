var websitedata = [
	{
		reg: "facebook.com",
		idfield: "#email",
		pwfield: "#pass",
		submit: "#loginbutton",
    loginpage: "https://www.facebook.com/login.php"
	},
	{
		reg:"google.com",
		idfield: "#Email",
		pwfield: "#Passwd",
		submit: "#signIn",
    loginpage: 
	},
  {
    reg: "rdio.com",
    idfield: "#username",
    pwfield: "#password",
    submit: "form.marketing .Form_Field_Button_Submit .button"
  }
];

function setUpListener(id, pw, submit, website){
	var idField = document.querySelector(id);
	var pwField = document.querySelector(pw);
  console.log("looking for " +submit);
	var submitButton = document.querySelector(submit);

  function loginListener(){
    console.log('id is:' + idField.value);
    console.log('id is:' + pwField.value);

    chrome.runtime.sendMessage({requestType: 'listen', id: idField.value, pw: pwField.value, site: website}, 
      function(response) {
      console.log(response.farewell);
    });
  }

	if(submitButton != null){
		console.log("submit button found!");
		submitButton.addEventListener("click", loginListener, false);
	}
}


function setUpListeners(){
  var location = window.location.href;
	for(var i = 0; i < websitedata.length; ++i){
		console.log("reg is " + websitedata[i].reg);
    console.log(location);
    var regexp = new RegExp(websitedata[i].reg);
		var result = regexp.test(location);
    console.log(result);
		if(result == true){
			console.log("regexp stuff found!");
			setUpListener(websitedata[i].idfield, websitedata[i].pwfield, websitedata[i].submit, websitedata[i].reg);
		}
	}
}

var loginService = function(sitedata, index){
  document.querySelector(websitedata[index].idfield).value = sitedata.savedid;
  document.querySelector(websitedata[index].pwfield).value = sitedata.savedpw;
  console.log(document.querySelector(websitedata[index].idfield).value);
  console.log(document.querySelector(websitedata[index].pwfield).value);

  document.querySelector(websitedata[index].submit).click();
}

var login = function(index){
  chrome.runtime.sendMessage({requestType: 'login', site: websitedata[0].reg}, function(response) {
    console.log(response);
    loginService(response, index);
  });
}

setUpListeners();
