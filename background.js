var setuplisteners = "var loc = window.location.href;"+
	"console.log(loc);"
var countpageloads = 0;
var loginWindowId = -4;
var spinnerWindowId = -5;
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
      loadTabs();
    }
  }
  else if(request.requestType === "close"){

    chrome.windows.getAll({populate: true}, function(windowArr){
        console.log(windowArr); 
        for(var i = 0; i < windowArr.length; ++i){
          for(var j = 0; j < windowArr[i].tabs.length; ++j){
            if(windowArr[i].tabs[j].url.indexOf("chrome-extension://")== 0)
              chrome.tabs.remove(windowArr[i].tabs[j].id);
          }

          chrome.windows.remove(windowArr[i].id);
        }
    });
  }
  else if(request.requestType === "restore"){
    loadUser(request.requestData);
    console.log("Restoring");
    sendResponse({farewell:"goodbye restoration"});    
  }
}


var loadTabs = function(){
  console.log("loading the tabs");
  chrome.windows.create({url: tabArray}, function(newWindow){
    chrome.windows.update(newWindow.id, { state: "maximized" })
  });
  countpageloads++;
  chrome.windows.remove(loginWindowId);
  chrome.windows.remove(spinnerWindowId);
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
            if(windowArr[i].tabs[j].url.indexOf("chrome-extension://")== 0)
              continue;
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
          data.loginPage = websitedata[i].loginpage;
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

  chrome.windows.create({url: "/loading.html"}, function(newWindow){
    spinnerWindowId = newWindow.id;
    chrome.windows.update(newWindow.id, { state: "maximized" });
  })

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


  chrome.windows.create({focused: false}, function(newWindow){
    loginWindowId = newWindow.id;
    for(var i = 0;  i < userData.accounts.length; ++i){
      chrome.tabs.create({ windowId : newWindow.id, url : userData.accounts[i].loginPage, active:false}, createTab(i, userData));
    } 
    if(numTabs == 0)
      loadTabs();
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

chrome.runtime.onMessage.addListener(loginListener);
chrome.tabs.onUpdated.addListener(changeListener);

chrome.runtime.onMessageExternal.addListener(function(msg, sender, cb){
  if (msg.hasOwnProperty("type") && msg.type === "close"){
    chrome.tabs.remove(sender.tab.id);
  }
});

//loadUser(exampleData);
