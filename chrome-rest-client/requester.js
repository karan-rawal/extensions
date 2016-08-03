
var statusCodes = new Array();
statusCodes[100] = 'Continue';
statusCodes[101] = 'Switching Protocols';

statusCodes[200] = 'OK';
statusCodes[201] = 'Created';
statusCodes[202] = 'Accepted';
statusCodes[203] = 'Non-Authoritative Information';
statusCodes[204] = 'No Content';
statusCodes[205] = 'Reset Content';
statusCodes[206] = 'Partial Content';

statusCodes[300] = 'Multiple Choices';
statusCodes[301] = 'Moved Permanently';
statusCodes[302] = 'Found';
statusCodes[303] = 'See Other';
statusCodes[304] = 'Not Modified';
statusCodes[305] = 'Use Proxy';
statusCodes[307] = 'Temporary Redirect';

statusCodes[400] = 'Bad Request';
statusCodes[401] = 'Unauthorized';
statusCodes[402] = 'Payment Required';
statusCodes[403] = 'Forbidden';
statusCodes[404] = 'Not Found';
statusCodes[405] = 'Method Not Allowed';
statusCodes[406] = 'Not Acceptable';
statusCodes[407] = 'Proxy Authentication Required';
statusCodes[408] = 'Request Time-out';
statusCodes[409] = 'Conflict';
statusCodes[410] = 'Gone';
statusCodes[411] = 'Length Required';
statusCodes[412] = 'Precondition Failed';
statusCodes[413] = 'Request Entity Too Large';
statusCodes[414] = 'Request-URI Too Long';
statusCodes[415] = 'Unsupported Media Type';
statusCodes[416] = 'Requested range not satisfiable';
statusCodes[417] = 'Expectation Failed';

statusCodes[500] = 'Internal Server Error';
statusCodes[501] = 'Not Implemented';
statusCodes[502] = 'Bad Gateway';
statusCodes[503] = 'Service Unavailable';
statusCodes[504] = 'Gateway Time-out';
statusCodes[505] = 'HTTP Version not supported';



function getResponse() {
  if (this.readyState == 4) {
    try {
      if(this.status == 0) {
        throw('Status = 0');
      }

      //this.status from array
      //this.status
      //jQuery.trim(this.getAllResponseHeaders())
      //jQuery.trim(this.responseText)

      $('#responseStatus').html(this.status +" "+statusCodes[this.status]);
      $('#responseHeaders').html(jQuery.trim(this.getAllResponseHeaders()));
      $('#responseText').html(jQuery.trim(this.responseText));





      console.info(this);

    }
    catch(e) {
    	console.error(e);
    }
  }
}



function sendRequest(){
	if($('#url').val() != ''){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = getResponse;

		try{
			//get values from the dom
			var method = $('input[name=method][type=radio]:checked').val();
			var url = $('#url').val();
			var headers = $('#headers').val();

			xhr.open(method,url,true);

			headers = headers.split("\n");
			for (var i = 0; i < headers.length; i++) {
				var header = headers[i].split(": ");
				if (header[1])
				    xhr.setRequestHeader(header[0],header[1]);
			}

			if(jQuery.inArray($("input[type=radio]:checked").val(), ["post", "put"]) > -1) {
				xhr.send($("#data").val());
			} else {
				xhr.send("");
			}


		}catch(exception){
			console.error(exception);
		}


	}else{
		console.error("Please provide a url.");
	}
}


