/*globals utils, chrome*/
(function(){
  "use strict";

  //var serverUrl = "https://protected-temple-7151.herokuapp.com";
  var serverUrl = "http://localhost:3000";
  var qs= utils.getUrlVars();
  var port = chrome.runtime.connect({name: "data"});
  port.postMessage({request: "userdata"});

  port.onMessage.addListener(function(response) {
    var url     = serverUrl + "/c/workspace/" + qs.workspace_id;
    var headers = {"X-RUFFLES-AUTHENTICATION": "email=\"" + qs.email + "\", pass=\"" + qs.pass +
                                               "\", version=\"1\""};
    utils.makeRequest(url, "POST", response, headers, function(err, res){
      if (err){
        return console.log("SHIIT", err);
      }
        return console.log("Success", err, res);
    });
  });
}());
