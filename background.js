var setuplisteners = "var loc = window.location.href;"+
	"console.log(loc);"

var changeListener = function(tabId, changeInfo, tab){
	if(changeInfo.url != undefined){
		chrome.tabs.executeScript(tabId, {code:"listen.js",runAt: "document_end"}, 
			function(){
				
		});
	}
}

var sendRequestListener = function(){

}

chrome.tabs.onUpdated.addListener(changeListener);

