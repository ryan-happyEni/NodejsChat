
var processDim;
processDim = processDim || (function () {
    var pleaseWaitDiv = $('<div class="modal hide" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"><div class="modal-header" style="color:#fff;width:250px;margin-top:15%;margin-left:38%;border-bottom:0px;"><h1>Processing...</h1></div></div>');
    return {
        showPleaseWait: function() {
            pleaseWaitDiv.modal();
        },
        hidePleaseWait: function () {
            pleaseWaitDiv.modal('hide');
        },

    };
})();


function JSONstringifyStyle(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, '\t');
    }

    var 
        arr = [],
        _string = 'color:green',
        _number = 'color:darkorange',
        _boolean = 'color:blue',
        _null = 'color:magenta',
        _key = 'color:red';

    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var style = _number;
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                style = _key;
            } else {
                style = _string;
            }
        } else if (/true|false/.test(match)) {
            style = _boolean;
        } else if (/null/.test(match)) {
            style = _null;
        } 
        return '<span style="'+ style + '">' + match + '</span>';
    });

    arr.unshift(json); 

    return arr;
}




function sendRequest(requestType, url, data, contentType, dataType, callBackFnc, errFnc){
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    
    var ajaxOption={};
    ajaxOption.type = requestType;
    ajaxOption.url = url;
    ajaxOption.data = data; 
	if(contentType!=null){
        ajaxOption.contentType = contentType;
    }
    if(dataType!=null){
        ajaxOption.dataType = dataType;
    }else{
        ajaxOption.processData = false;
    }  
    ajaxOption.cache = false;
    ajaxOption.timeout = 1000*60;
    ajaxOption.beforeSend=function(xhr) {
        if (header && token) {
            xhr.setRequestHeader(header, token);
        }
    }
    ajaxOption.success=function(returnData) {
        if(callBackFnc!=null){
            callBackFnc(returnData);
        }
    }
    ajaxOption.error=function(returnData) {
        sendRequestErrorHandler(e, errFnc);
    }
    $.ajax(ajaxOption);
}

function sendRequestErrorHandler(e, errFnc){
	var errorData = JSON.parse(JSON.stringify(e));
	if(errFnc!=null){
		errFnc(errorData);
	}
}
