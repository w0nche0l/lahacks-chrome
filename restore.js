/*globals chrome, utils*/
(function(){
  "use strict";

  var qs        = utils.getUrlVars(),
      serverUrl = "http://wormhole-api.cloudapp.net",
      getWorkspaceData;

  getWorkspaceData = function(cb){
    var url     = serverUrl + "/c/workspace/" + qs.workspace_id;
    var headers = {"X-RUFFLES-AUTHENTICATION": "email=\"" + qs.email + "\", pass=\"" + qs.pass +
                                               "\", version=\"1\""};
    utils.makeRequest(url, "GET", null, headers, function(err, data){
      if (err){
        return cb(err);
      }
      if (data._err !== 0){
        return cb({err: data});
      }
      return cb(null, data.workspace);
    });
  };

  getWorkspaceData(function(err, data){
    console.log("got data", err, data);
    if(err){
      console.log("error:" + err);
    }
    else{
      chrome.runtime.sendMessage({requestType: 'restore', requestData:data}, 
      function(response) {
        console.log(response.farewell);
      });  
    }
  });
}());
