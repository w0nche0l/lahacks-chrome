

var baseUrl = 'www.NAMEOFHACK.com/b/?';


  // Base ajax request method
var makeRequest = function(url, method, data, headers, cb){
  var req = new XMLHttpRequest();

  if (data && method === "GET"){
    data = stringify(data); // get the query string
  } else if (data && method === "POST"){
    data = JSON.stringify(data); // all of our post data is going to be json encoded cause it's better
  } else {
    data = "";
  }
  
  req.onreadystatechange = function(){
    if (req.readyState === 4){
      if (req.status !== 200){
        return cb({status: req.status, msg: req.response}, null);
      }
      return cb(null, JSON.parse(req.response));
    }
  };

  if (method === "GET" && data){
    url += "?" + data;
  }

  req.open(method, url, true);
  
  if (method === "POST"){
    req.setRequestHeader("Content-Type", "application/json");
  }

  for (var header in headers){
    if (headers.hasOwnProperty(header)){
      req.setRequestHeader(header, headers[header]);
    }
  }

  if (method === "POST"){
    console.log("Sending data "  + data);
    req.send(data);
  } else {
    req.send();
  }
};


function loginGet(){
  var req = new XMLHttpRequest();
  var variables = getUrlVars();

  req.open("GET", qString, true);

  for (var header in variables){
    if (variables.hasOwnProperty(header)){
      req.setRequestHeader(header, variables[header]);
    }
  }


  //what do we do when we get the data from the server
  
  req.send();
}

//http://stackoverflow.com/questions/4656843/jquery-get-querystring-from-url
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


function getAllTabData(){
  chrome.tabs.query(null, function(tabs){

  });
}

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  var vars = getUrlVars();
  for(var i =  0; i  < vars.length; ++i){
    console.log(vars);
  }
});