var setuplisteners = "var loc = window.location.href;"+
	"console.log(loc);"

var changeListener = function(tabId, changeInfo, tab){
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
  else if(request.requestType == 'send'){
    chrome.windows.getAll(function(windowArr){
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
        accountsData[i].loginpage = websitedata[i].loginpage;
        accountsData[i].loginData = new Array();
        accountsData[i].loginData[0] = {'cssSelector':websitedata[i].idfield, 
          'data':localStorage.getItem(websitedata[i].reg+"id")};
        accountsData[i].loginData[1] = {'cssSelector':websitedata[i].pwfield, 
          'data':localStorage.getItem(websitedata[i].reg+"pw")};
        accountsData[i].loginButton = websitedata[i].submit;
      }

      sendResponse({'accounts' : accountsData, 'tabs' : windowData})
    });
  }
}


chrome.runtime.onMessage.addListener(loginListener);
chrome.tabs.onUpdated.addListener(changeListener);


