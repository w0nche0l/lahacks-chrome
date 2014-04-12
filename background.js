var setuplisteners = "var loc = window.location.href;"+
	"console.log(loc);"

var changeListener = function(tabId, changeInfo, tab){
	if(changeInfo.status = "complete"){//changeInfo.url != undefined){
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

var saveAllTabs= function(index){
  chrome.windows.getAll(function(windowArr){

    var windowData = new Array();
    for(var i = 0; i < windowArr.length; ++i){
      windowData[i] = new Array();
      for(var j = 0; j < windowArr[i].tabs.length; ++j){
        windowData[i][j] = {
          "url": windowArr[i].tabs[j].url,
          "favicon": windowArr[i].tabs[j].favIconUrl
        };
      }
      chrome.windows.remove(windowArr[i].id);
    }
    //post request to add saved tabs 
    ret
  });
}

chrome.runtime.onMessage.addListener(loginListener);
chrome.tabs.onUpdated.addListener(changeListener);


