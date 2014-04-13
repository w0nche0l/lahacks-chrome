//X-RUFFLES-AUTHENTICATION: email=\"(.*?)\", pass=\"(.*?)\", version=\"(.*?)\"
//  workspaceid, email, password
// url:  /c/workspace/workspaceid 
// {
//    "accounts":[
//       {
//          "loginPage":"https://facebook.com/login.ph",
//          "loginData":[
//             {
//                "cssSelector":"#email",
//                "data":"jteplitz602@gmail.com"
//             },
//             {
//                "cssSelector":"#pass",
//                "data":"pass"
//             }
//          ],
//          "loginButton":"#login input"
//       }
//    ],
//    "tabs":[
//       {
//          "url":"facebook.com",
//          "favicon":"favicon_url"
//       },
//       {
//          "url":"google.com",
//          "favicon":"google_favicon_url"
//       }
//    ]
// }
//response contains data in json format above
chrome.runtime.sendMessage({requestType: 'send'}, 
	function(response){
		console.log('aslkdfjlkasjdf');
		console.log(response);
});	


// var url = "www.blah.com";

// "/c/workspace/"  + workspaceid+ "?email=" + email + "&pass="+ password + "&version=1"; 