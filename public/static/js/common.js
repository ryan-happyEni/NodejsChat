
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