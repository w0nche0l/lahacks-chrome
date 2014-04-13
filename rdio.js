/*globals utils R chrome */
(function(){
  "use strict";

  var queryString = utils.getUrlVars(),
      rdioReady, savePlaySource,
      baseUrl = "http://wormhole-api.cloudapp.net";

  chrome.tabs.create({
    url: baseUrl + "/rdio_login.html",
    active: false
  }, function(tabInfo){
    chrome.runtime.onMessageExternal.addListener(function(msg, sender, cb){
      if (!msg.hasOwnProperty("type") || msg.type !== "rdio"){
        return;
      }

      R.accessToken(msg.accessToken);
      R.ready(rdioReady);
      chrome.tabs.remove(tabInfo.id);
    });
  });

  rdioReady = function(ready){
    if (!ready){
      return;
    }

    if (queryString.workspace_id){
      // save their current playlist
      var playSource = R.player.queue.at(0);
      if (playSource){
        return savePlaySource(playSource);
      }
    }

    R.request({
      method: "getPlaylists",
      success: function(res){
        console.log("playlists", res);
      }
    });
    R.player.play({source: queryString.play_source});
  };

  savePlaySource = function(source){
    var url     = baseUrl + "/c/workspace/" + queryString.workspace_id + "/rdio";
    var headers = {"X-RUFFLES-AUTHENTICATION": "email=\"" + queryString.email + "\", pass=\"" + queryString.pass                     +"\", version=\"1\""};
    utils.makeRequest(url, "POST", {playSource: source}, headers, function(err, res){
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
  };
}());
