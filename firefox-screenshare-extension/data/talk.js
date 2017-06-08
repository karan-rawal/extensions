// Author - Karan Rawal
//This will send a ping that the plugin has been installed


window.postMessage({type : 'SS_PING'},'https://localhost.com');


window.addEventListener("addon-message", function(event) {
	if(event.detail.type != undefined){
		if(event.detail.type != 'SS_PING'){
			self.postMessage(event.detail,"*");
		}
	}
}, false);

self.port.on("add-on-response", function(message) {
	if(message.type === 'SS_ENABLE'){
		if(message != undefined)
			window.postMessage(message,'https://localhost.com');
	}else if(message.type === 'SS_DISABLE'){
		if(message != undefined)	
			window.postMessage(message,'https://localhost.com');
	}
});


