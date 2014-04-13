/*globals Kloudless utils chrome*/
(function(){
  "use strict";
  var onload, queryString = utils.getUrlVars();

  onload = function(){
    var formString = "<form method='POST' action='http://wormhole-api.cloudapp.net/u/kloudless' style='display: none;'>" +
    //var formString = "<form method='POST' action='http://localhost:3000/u/kloudless' style='display: none;'>" +
                   "<input type='hidden' name='email' value=\"" + queryString.email   + "\">" +
                   "<input type='hidden' name='pass' value=\"" + queryString.pass     + "\">"+
                   "<input type='hidden' name='type' value=\"init\">"+
                 "</form>";
    console.log("Form", formString);
    var form = $(formString);
    $("body").append(form);
    form.submit();
  };

  $(document).ready(onload);
}());
