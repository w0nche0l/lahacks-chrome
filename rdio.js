/*globals utils R chrome */
(function(){
  "use strict";

  var queryString = utils.getUrlVars(),
      rdioReady;

  chrome.tabs.create({
    url: "https://protected-temple-7151.herokuapp.com/rdio_login.html",
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

    R.request({
      method: "getPlaylists",
      success: function(res){
        console.log("playlists", res);
      }
    });
    R.player.play({source: queryString.play_source});
  };
}());
