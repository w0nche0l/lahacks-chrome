/*globals utils, chrome*/
(function(){
  "use strict";
  //var serverUrl = "http://localhost:3000";
  var serverUrl = "http://wormhole-api.cloudapp.net";
  var qs        = utils.getUrlVars();

  var port = chrome.runtime.connect({name: "data"});
  port.postMessage({request: "userdata"});
  port.onMessage.addListener(function(response) {
    var url     = serverUrl + "/c/workspace/" + qs.workspace_id;
    var headers = {"X-RUFFLES-AUTHENTICATION": "email=\"" + qs.email + "\", pass=\"" + qs.pass +
                                               "\", version=\"1\""};
    utils.makeRequest(url, "POST", response, headers, function(err, res){
      if (err){
        console.log("SHIIT", err);
      }
        console.log("Success", err, res);
      close();
      chrome.runtime.sendMessage({requestType: 'close'},
        function(response) {
        console.log(response.farewell);
      });

    });
  });

  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  var url = "chrome-extension://dihjneilmgoagbmdbgonjhlkaiagoand/rdio.html?" + hashes;
  chrome.tabs.create({
    url: url,
    active: false
  });
}());
