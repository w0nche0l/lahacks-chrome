var loginService = function(sitedata, index){
  document.querySelector(websitedata[index].idfield).value = sitedata.savedid;
  document.querySelector(websitedata[index].pwfield).value = sitedata.savedpw;
  console.log(document.querySelector(websitedata[index].idfield).value);
  console.log(document.querySelector(websitedata[index].pwfield).value);

  document.querySelector(websitedata[index].submit).click();
}

var login = function(sitedata, index){
  document.querySelector(websitedata[index].idfield).value = sitedata.savedid;
  document.querySelector(websitedata[index].pwfield).value = sitedata.savedpw;
  console.log(document.querySelector(websitedata[index].idfield).value);
  console.log(document.querySelector(websitedata[index].pwfield).value);

  document.querySelector(websitedata[index].submit).click();
}


