'use strict';

var dataSources = ['screen', 'window'];
var desktopMediaRequestId = '';


var injected = false;


function inject(){

  chrome.tabs.query({}, function(tabs) {
    for(var i =0 ; i< tabs.length ; i++) {
	
      if(tabs[i].url != undefined){
        if(tabs[i].url.indexOf('localhost') > -1){
          if(!injected){
	    console.log(tabs[i]);
            chrome.tabs.executeScript(tabs[i].id, {file: "content-script.js"}, function() {
              injected = true;
            });
          }
        }

      }
    }
  });
}

inject();


chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    if (msg.type === 'SS_UI_REQUEST') {
      requestScreenSharing(port, msg);
    }

    if (msg.type === 'SS_UI_CANCEL') {
      cancelScreenSharing(msg);
    }
  });
});

function requestScreenSharing(port, msg) {
  // https://developer.chrome.com/extensions/desktopCapture
  // params:
  //  - 'dataSources' Set of sources that should be shown to the user.
  //  - 'targetTab' Tab for which the stream is created.
  //  - 'streamId' String that can be passed to getUserMedia() API
  desktopMediaRequestId =
      chrome.desktopCapture.chooseDesktopMedia(dataSources, port.sender.tab,
          function(streamId) {
            if (streamId) {
              msg.type = 'SS_DIALOG_SUCCESS';
              msg.streamId = streamId;
            } else {
              msg.type = 'SS_DIALOG_CANCEL';
            }
            port.postMessage(msg);
          });
}

function cancelScreenSharing() {
  if (desktopMediaRequestId) {
    chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId);
  }
}
