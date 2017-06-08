var buttons = require('sdk/ui/button/action');
var prefService = require('sdk/preferences/service');

var listOfAllowedDomainsFlag = 'media.getusermedia.screensharing.allowed_domains';
var enableScreenCapturingFlag = 'media.getusermedia.screensharing.enabled';

// replace your own domains with below array
var arrayOfMyOwnDomains = [
'localhost.com',
];

// e.g. if 127.0.0.1 or localhost is already allowed by anyone else
var listOfSimilarAlreadyAllowedDomains = [];





/* Karan Rawal */


var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");




function onMessage(message,worker){
  var tabs = require("sdk/tabs");

  if(message.type === 'SS_ENABLE'){
    enableScreenShare();
    message.response = "OK";
    if(tabs.activeTab.url.indexOf('liveh2h.com') > -1){
      worker.port.emit("add-on-response",message);
    }
  }else if(message.type === 'SS_DISABLE'){
    disableScreenShare();
    message.response = "OK";
    if(tabs.activeTab.url.indexOf('liveh2h.com') > -1){
      worker.port.emit("add-on-response",message);
    }
  }
}



function inject(){
  var tabs = require("sdk/tabs");
  var i=0;
  for(i=0;i < tabs.length; i++){

    if(tabs[i].url.indexOf('liveh2h.com') > -1){

	    var talkWorker = tabs[i].attach({contentScriptFile : ['talk.js']});
	    talkWorker.on('message', function(message){
	      onMessage(message,talkWorker);
	    });

    }
  }
}

//inject only once - needed for inline installation(to inject content script)
inject();


//This will attach content script to any tab(after extension is already installed)

pageMod.PageMod({
  include: "*.liveh2h.com",
  contentScriptFile: data.url("talk.js"),
  onAttach: function(worker) {
  	worker.on('message', function(message) {
      onMessage(message,worker);
    });
  }
});


function enableScreenShare() {
	//set flag
	if(require("sdk/preferences/service").get(enableScreenCapturingFlag) == false) {
		prefService.set(enableScreenCapturingFlag, true);
	}
	
	//set domain
	var existingDomains = prefService.get(listOfAllowedDomainsFlag).split(',');
	arrayOfMyOwnDomains.forEach(function(domain) {
   if (existingDomains.indexOf(domain) === -1) {
    existingDomains.push(domain);
  }
});
 prefService.set(listOfAllowedDomainsFlag, existingDomains.join(','));
}


function disableScreenShare() {
    //set flag
    if(require("sdk/preferences/service").get(enableScreenCapturingFlag) == true) {
     prefService.set(enableScreenCapturingFlag, false);
   }
   
   var externalDomains = [];
   prefService.get(listOfAllowedDomainsFlag).split(',').forEach(function(domain) {
        // Skip Others Domains
        if (arrayOfMyOwnDomains.indexOf(domain) === -1) {
            // if its NOT mine, keep it.
            externalDomains.push(domain);
          } else if (listOfSimilarAlreadyAllowedDomains.indexOf(domain) !== -1) {
            // seems that localhost/127.0.0.1 are already added by external users
            externalDomains.push(domain);
          }
        });

   prefService.set(listOfAllowedDomainsFlag, externalDomains.join(','));
 }


//when plugin is uninstalled
exports.onUnload = function() {
 	disableScreenShare();
}

