
$.fn.extend({
    treed: function (o) {
    
        var openedClass = 'glyphicon-minus-sign';
        var closedClass = 'glyphicon-plus-sign';
        
        if (typeof o != 'undefined'){
            if (typeof o.openedClass != 'undefined'){
                openedClass = o.openedClass;
            }
            if (typeof o.closedClass != 'undefined'){
                closedClass = o.closedClass;
            }
        };
    
        //initialize each of the top levels
        var tree = $(this);
        tree.addClass("tree");
        tree.find('li').has("ul").each(function () {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='indicator glyphicon " + closedClass + "'>+</i>");
            branch.addClass('branch');
            branch.on('click', function (e) {
                if (this == e.target) {
                    var icon = $(this).children('i:first');
                    if(icon.html()=="-"){
                        icon.html("+");
                    }else{
                        icon.html("-");
                        var id = ($(this).children('ul:first')[0].id);
                        if("atoz"!=id && "0to9"!=id){
                            searchKey="";
                            loadKeyList(id, "["+id+id.toUpperCase()+"]*");
                        }
                    }
                    icon.toggleClass(openedClass + " " + closedClass);
                    $(this).children().children().toggle();
                }
            })
            branch.children().children().toggle();
        });
        //fire event from the dynamically added icon
        tree.find('.branch .indicator').each(function(){
            $(this).on('click', function () {
                $(this).closest('li').click();
            });
        });
        //fire event to open branch if the li contains an anchor instead of text
        tree.find('.branch>a').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
        //fire event to open branch if the li contains a button instead of text
        tree.find('.branch>button').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
    }
});
        
var atoz = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "etc"];

var keylist = $("#atoz");
keylist.empty();
for(var i=0; i<atoz.length; i++){
    var li = document.createElement("li");     
    keylist.append(li);        
    li.appendChild(document.createTextNode(atoz[i]));
    var ul = document.createElement("ul");
    li.appendChild(ul);

    ul.id = "atoz_"+atoz[i];
}

var keylist = $("#0to9");
keylist.empty();
for(var i=0; i<10; i++){
    var li = document.createElement("li");     
    keylist.append(li);        
    li.appendChild(document.createTextNode(i));
    var ul = document.createElement("ul");
    li.appendChild(ul);

    ul.id = "0to9_"+i;
}

 
var listIndex=0;
var currentPage=0;
var searchKey = "";
function loadKeyList(targetid, search){ 
    var param = {}; 
    currentPage=0;
    param.search = search.replace("atoz_", "").replace("0to9_", ""); 
    processDim.showPleaseWait();

    $.ajax({
        type: "POST", 
        url: "keys", 
        data: param,
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {  
            $("#tree .active").removeClass("active");    
            if(data!=null){
                $.each(data, function( index, value ) {
                    var parentKey = value!=null&&value.length>0?value.substring(0, 1):"etc";
                    $("#atoz_"+parentKey).empty();
                    $("#0to9_"+parentKey).empty();
                    $("#atoz_etc").empty();
                });
                $.each(data, function( index, value ) {
                    var parentKey = value!=null&&value.length>0?value.substring(0, 1):"etc";
                    var parent = $("#atoz_etc");
                    if(/[0-9]/.test(parentKey)){
                        parent = $("#0to9_"+parentKey);
                    }else if(/[a-zA-Z]/.test(parentKey)){
                        parent = $("#atoz_"+parentKey);
                    }
                    var li = document.createElement("li");
                    var alink = document.createElement("a");
                    li.appendChild(alink);
                    alink.innerHTML = value;
                    alink.style.cursor="pointer";
                    alink.onclick=function(){
                        $("#tree .active").removeClass("active");  
                        $(this).addClass("active");  
                        loadInfo(this, value);
                    }
                    if(searchKey==value){
                        alink.className="active";
                    }
                    parent.append(li);
                });
            }

            var subtop = $("#tree .active").length==0?0:$($("#tree .active")[0]).parent().position().top;
            if(targetid.indexOf("*")<0){
                if($("#"+targetid).length>0){
                    if(targetid.indexOf("atoz")>-1){
                        $("#tree").animate({
                            scrollTop: $("#"+targetid).parent().position().top+subtop
                        }, 'slow'); 
                    }else{ 
                        $("#tree").animate({
                            scrollTop: $("#atoz-group").height()+$("#"+targetid).parent().position().top+subtop
                        }, 'slow');
                    }
                }
            }
            processDim.hidePleaseWait();
        },
        error: function (e) {
            var errorData = JSON.parse(JSON.stringify(e));
            console.log(errorData); 
        }
    });
}

var selectedItem = null;
var selectedKey = null;
var selectedKeyType = null;
function loadInfo(target, key){
    var valuelist = $("#valuelist");
    valuelist.empty();

    selectedItem = target;
    selectedKey = key;
    $("#key_name").html(key);
    var param = {}; 
    param.key = key;   

    var requestType = "POST";
    var url = "key/info";
    var contentType = null;
    var dataType="json";
    var data = param;
    sendRequest(requestType, url, data, contentType, dataType, function(returnData){
        $("#key_type").html(returnData); 
        selectedKeyType = returnData;
        getDataSize(key, returnData);
        loadData();
    }, null);
} 

function getDataSize(key, type){ 
    var param = {}; 
    param.key = key;   
    param.type = type;

    var requestType = "POST";
    var url = "key/data/size";
    var contentType = null;
    var dataType="json";
    var data = param;
    sendRequest(requestType, url, data, contentType, dataType, function(returnData){
        $("#key_data_size").html(returnData);   
    }, null); 
}

function viewData(value){ 
    try{
        var json = JSON.parse(value); 
        editor.set(json);
    }catch(e){
        editor.set(value);
    }
    $(".nav-pills > li > a")[2].click();
}


function loadData(){
    if(selectedKey!=null && selectedKeyType!=null){ 
        var param = {}; 
        param.key = selectedKey;   
        
        var url = "";
        if(selectedKeyType=="zset"){
            var viewsize = 10;
            url = "zrange";                    
            param.start = (currentPage*viewsize);  
            param.end = (param.start+viewsize)-1;  
        }else if(selectedKeyType=="set"){
            currentPage=0; 
            url = "smembers";
        }else if(selectedKeyType=="hash"){
            currentPage=0; 
            url = "hgetall";
        }else if(selectedKeyType=="string"){
            currentPage=0; 
            url = "get";
        }else if(selectedKeyType=="list"){
            var viewsize = 10;
            url = "lrange";                    
            param.start = (currentPage*viewsize); 
            param.end = (param.start+viewsize)-1; 
        }

        if(url!=""){
            var requestType = "POST";
            var url = url;
            var contentType = null;
            var dataType="json";
            var data = param;
            
            sendRequest(requestType, url, data, contentType, dataType, function(returnData){     
                var valuelist = $("#valuelist");
                if(currentPage==0){
                    valuelist.empty();
                }else{ 
                    valuelist.children(".pageNo"+(currentPage)).remove();
                }
                if(returnData!=null){
                    if(returnData.length>0){  
                        $.each(returnData, function( index, value ) {
                            var tr = document.createElement("tr");
                            tr.className="pageNo"+currentPage;
                            valuelist.append(tr);
                            var td = document.createElement("td");
                            tr.appendChild(td);
                            var checkbox = document.createElement("input");
                            checkbox.type="checkbox";
                            td.appendChild(checkbox); 
                            var td = document.createElement("td");
                            tr.appendChild(td);
                            td.innerHTML =((currentPage*10)+index+1);
                            var td = document.createElement("td");
                            tr.appendChild(td);  
                            
                            try{
                                var obj = JSON.parse(value); 
                                td.innerHTML = "<div class='jsonDiv'><pre>"+JSONstringifyStyle(obj)+"</pre></div>" ;
                                td.style.cursor="pointer";
                                td.onclick=function(){
                                    viewData(value);
                                }
                            }catch(e){ 
                                td.innerHTML = "<div class='jsonDiv'><pre>"+JSONstringifyStyle(value)+"</pre></div>" ; 
                            } 
                        }); 
                        if(returnData.length%10==0){
                            currentPage++;
                        }
                    }else if(returnData.length==undefined){ 
                        if(selectedKeyType=="hash"){
                            var keys = Object.keys(returnData);
                            for(var i=0; i<keys.length; i++){ 
                                var tr = document.createElement("tr");
                                valuelist.append(tr);
                                var td = document.createElement("td");
                                tr.appendChild(td);
                                var checkbox = document.createElement("input");
                                checkbox.type="checkbox";
                                td.appendChild(checkbox); 
                                var td = document.createElement("td");
                                tr.appendChild(td);
                                td.innerHTML =(i+1);
                                var td = document.createElement("td");
                                tr.appendChild(td);                                      
                                td.innerHTML = "<div class='jsonDiv'><pre><span style='color:red;'>"+keys[i]+"</span> : <span style='color:green;'>"+returnData[keys[i]]+"</span></pre></div>" ;
                                                                        
                                td.onclick=function(){
                                    viewData(returnData);
                                }
                            }
                        }else{
                            var tr = document.createElement("tr");
                            valuelist.append(tr);
                            var td = document.createElement("td");
                            tr.appendChild(td);
                            var checkbox = document.createElement("input");
                            checkbox.type="checkbox";
                            td.appendChild(checkbox); 
                            var td = document.createElement("td");
                            tr.appendChild(td);
                            td.innerHTML =(1);
                            var td = document.createElement("td");
                            tr.appendChild(td);                                      
                            td.innerHTML = "<div class='jsonDiv'><pre>"+JSONstringifyStyle(returnData)+"</pre></div>" ;
                            td.onclick=function(){
                                viewData(returnData);
                            }
                        }
                        
                        valuelist.append(returnData)
                    }
                }else{
                    var tr = document.createElement("tr");
                    valuelist.append(tr);
                    var td = document.createElement("td");
                    td.colspan="3";
                    td.innerHTML = "Empty.";
                    valuelist.append(returnData)
                } 
                var jsonDivW = $(document.body).width()-250-$("#tree").width();
                var width = $("#tab2").parent().width();
                if(jsonDivW<(width*0.7)){
                    jsonDivW=(width*0.7);
                }
                $('.jsonDiv').css("width", (jsonDivW)+"px"); 
            }, null);
        }
    }
}

function getRedisInfo(){ 
    var param = {};

    var requestType = "POST";
    var url = "info";
    var contentType = null;
    var dataType="json";
    var data = param;
     
    sendRequest(requestType, url, data, contentType, dataType, function(returnData){
        var info = returnData.toString();                     
        var 
            arr = [],
            _string = 'color:green',
            _number = 'color:darkorange',
            _boolean = 'color:blue',
            _null = 'color:magenta',
            _key = 'color:red';

        var json = info.replace(/# ([a-zA-Z0-9]+)?|[\S]*:/g, function (match) {
            var sp = match.split(":");
            if(match.indexOf("#")==0){
                return '<span style="'+ _string + '">' + match + '</span>'; 
            }else{
                return '<span style="'+ _key + '">' + sp[0] + '</span>'+"<span>&nbsp;&nbsp;:&nbsp;&nbsp;</span>"; 
            }

        }); 
        $("#redis_server_info").html("<pre>"+json+"</pre>");  
    }, null);
}

var deleteKeyList=[];
function deleteKey(){ 
    var param = {};

    var requestType = "POST";
    var url = "info";
    var contentType = null;
    var dataType="json";
    var data = param;
     
    sendRequest(requestType, url, data, contentType, dataType, function(returnData){
        var info = returnData.toString();                     
        var 
            arr = [],
            _string = 'color:green',
            _number = 'color:darkorange',
            _boolean = 'color:blue',
            _null = 'color:magenta',
            _key = 'color:red';

        var json = info.replace(/# ([a-zA-Z0-9]+)?|[\S]*:/g, function (match) {
            var sp = match.split(":");
            if(match.indexOf("#")==0){
                return '<span style="'+ _string + '">' + match + '</span>'; 
            }else{
                return '<span style="'+ _key + '">' + sp[0] + '</span>'+"<span>&nbsp;&nbsp;:&nbsp;&nbsp;</span>"; 
            }

        }); 
        $("#redis_server_info").html("<pre>"+json+"</pre>");  
    }, null);
}

$('#tabArea > ul > li').click(function(){ 
    $('#tabArea > ul > li').removeClass("active");
    $(this).addClass("active");
});

$("#btn_more").click(function(){
    loadData();
});

$("#btn_get").click(function(){
    var searchTxt = $("#search").val().trim();
    if(searchTxt.length>0){
        var st = searchTxt.substring(0, 1);
        var searchid = "";
        var group = "";
        var prefix = "";
        if(/[0-9]/.test(st)){
            group="0to9";
            prefix=group+"_"+st;
        }else if(/[a-zA-Z]/.test(st)){
            group="atoz";
            prefix=group+"_"+st;
        }else{
            group="atoz";
            prefix=group+"_etc";
        }
        
        if($("#"+group+"-group > .glyphicon-plus-sign").length==1){
            $("#"+group+"-group").click();
        }
        
        searchKey = $("#search").val().trim();
        if($("#"+prefix).parent().find(".glyphicon-plus-sign").length==1){
            $("#"+prefix).parent().find(".indicator").removeClass("glyphicon-plus-sign");
            $("#"+prefix).parent().find(".indicator").addClass("glyphicon-minus-sign");
            $("#"+prefix).parent().find(".indicator").html("-")
        }   
        $("#tree > li > ul > li > ul").empty();
        var search = searchKey.indexOf("*")>-1?searchKey:st+"*";
        loadKeyList(prefix, search);
    }
});

$("#btn_del_key").click(function(){
    if(selectedKey==null || selectedKey == ""){
        alert("Pleas select key.");
        return;
    }

    var msg = "Are you sure you want to delete?";
    if(confirm(msg)){
        var param = {};
        param.key = selectedKey;

        var url = "del";
        if(selectedKeyType=="hash"){
            url += "/hash";
        }else if(selectedKeyType=="set"){
            url += "/set";
        }else if(selectedKeyType=="zset"){
            url += "/zset";
        }

        var requestType = "POST";
        //var url = "del";
        var contentType = null;
        var dataType="json";
        var data = param;
        
        sendRequest(requestType, url, data, contentType, dataType, function(returnData){
            var sp = selectedKey.substring(0, 1);
            if(/[0-9]/.test(sp)){
                id = "0to9_"+sp;
            }else if(/[a-zA-Z]/.test(sp)){
                id = "atoz_"+sp;
            }else{
                id = "atoz_ec";
            } 
            $(selectedItem).parent().remove();
            //loadKeyList(id, sp+"*");
        }, null);
    }
}); 

getRedisInfo();