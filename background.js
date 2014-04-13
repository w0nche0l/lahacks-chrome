var setuplisteners = "var loc = window.location.href;"+
	"console.log(loc);"

var changeListener = function(tabId, changeInfo, tab){
  var reg = new RegExp('send.html');
  if(reg.test(tab.url)  && changeInfo.status == "complete"){
    chrome.tabs.executeScript(tabId, {file:'send.js', runAt: 'document_end'}, function(){});
  }

	if(changeInfo.status = "complete"){//changeInfo.url != undefined){
    chrome.tabs.executeScript(tabId, {file:"data.js",runAt: "document_end"}, 
      function(){
    });
		chrome.tabs.executeScript(tabId, {file:"listen.js",runAt: "document_end"}, 
			function(){
		});
	}
}

var loginListener = function(request, sender, sendResponse) {
	console.log(request);
	if(request.requestType === 'listen'){
	  	console.log("yay stealing");
	  	console.log("id is " + request.id + " password is "+ request.pw + " website is "  + request.site)
	    console.log(sender.tab ?
	                "from a content script:" + sender.tab.url :
	                "from the extension");
	    localStorage.setItem(request.site+"id" , request.id);
	    localStorage.setItem(request.site+"pw" , request.pw);

	    console.log("saved id: " + localStorage.getItem(request.site+"id"));
	    console.log("saved pw: " + localStorage.getItem(request.site+"pw"));

		sendResponse({farewell: "goodbye"});
	}
	else if(request.requestType == 'login'){
		sendResponse({savedid: localStorage.getItem(request.site+"id"), 
			savedpw: localStorage.getItem(request.site+"pw")});
	}
}


chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "data");
  port.onMessage.addListener(function(msg) {
    if (msg.request == "userdata"){
      chrome.windows.getAll({populate: true}, function(windowArr){
        console.log(windowArr);
        var tabData = new Array();
        var count = 0; 
        for(var i = 0; i < windowArr.length; ++i){
          for(var j = 0; j < windowArr[i].tabs.length; ++j){
            tabData[count] = {
              "url": windowArr[i].tabs[j].url,
              "favicon": windowArr[i].tabs[j].favIconUrl
            };
            count++;
          }
          //chrome.windows.remove(windowArr[i].id);
        }
        var accountsData = new Array();
        for(var i = 0; i < websitedata.length; ++i){
          
          var data = {};
          data.loginpage = websitedata[i].loginpage;
          data.loginData = new Array();
          if(localStorage.getItem(websitedata[i].reg+"id") == null || 
            localStorage.getItem(websitedata[i].reg+"pw") == null){
            break;
          }
          data.loginData[0] = {'cssSelector':websitedata[i].idfield, 
            'data':localStorage.getItem(websitedata[i].reg+"id")};
          data.loginData[1] = {'cssSelector':websitedata[i].pwfield, 
            'data':localStorage.getItem(websitedata[i].reg+"pw")};
          data.loginButton = websitedata[i].submit;
          accountsData.push(data);
        }
        console.log(accountsData);
        console.log(tabData);
        port.postMessage({accounts : accountsData, tabs : tabData});
      });
    }
  });
});



var loadUser = function(userData){  
  console.log(userData);
  chrome.windows.create({}, function(newWindow){
    for(var i = 0;  i < userData.accounts.length; ++i){
      var j = i;
      chrome.tabs.create({ windowId : newWindow.id, url : userData.accounts[j].loginPage }, function(newTab){
        //do some function here to log into each service 
        var execCode = 'var formsData = ' + JSON.stringify(userData.accounts[j].loginData) + ';'
        + 'var loginButton  = ' + JSON.stringify(userData.accounts[j].loginButton) + ';';
        console.log(execCode);
        chrome.tabs.executeScript(newTab.id, {code: execCode, runAt: 'document_end'}, function(){});
        chrome.tabs.executeScript(newTab.id, {file: 'login.js', runAt: 'document_end'}, function(){});
      });
    }
    
  });

  chrome.windows.create({}, function(newWindow){
    for(var i = 0; i < userData.tabs.length; ++i){
      chrome.tabs.create({windowId: newWindow.id, url: userData.tabs[i].url}, function(newTab){});
    }
  }
}

var exampleData = {
   "accounts":[
      {
         "loginPage":"https://facebook.com/login.php",
         "loginData":[
            {
               "cssSelector":"#email",
               "data":"jteplitz602@gmail.com"
            },
            {
               "cssSelector":"#pass",
               "data":"pass"
            }
         ],
         "loginButton":"#loginbutton"
      },
      {
        "loginPage":"https://accounts.google.com/ServiceLogin?sacu=1",
        "loginData":[
            {
               "cssSelector":"#Email",
               "data":"lahackstest@gmail.com"
            },
            {
               "cssSelector":"#Passwd",
               "data":"ddddddddd"
            }
        ],
        "loginButton":"#signIn"
      }
   ],
   "tabs":[
      {
         "url":"http://tumblr.com",
         "favicon":"favicon_url"
      }
   ]
};


chrome.runtime.onMessage.addListener(loginListener);
chrome.tabs.onUpdated.addListener(changeListener);

chrome.runtime.onMessageExternal.addListener(function(msg, sender, cb){
  if (msg.hasOwnProperty("type") && msg.type === "close"){
    chrome.tabs.remove(sender.tab.id);
  }
});

loadUser(exampleData);
