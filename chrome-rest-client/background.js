//Fired when User Clicks on the extension ICON
chrome.browserAction.onClicked.addListener(function (tab) {
    
    var extensionId = chrome.runtime.id;
    var extensionUrl = 'chrome-extension://'+extensionId+'/index.html';

    chrome.tabs.create({url : extensionUrl, active : true});

});