
    var host = window.location.protocol + "//" + window.location.host+"/chatio"; 
    var url_join = 'join';
    var url_leave = 'leave';
    var url_chat = 'chat';
    var messageListId = 'chatList';
    var messageidx=0;
    var initHost = false;

    ChatManager.prototype.send = function(message){ 
        if(_isconnected){
            _socket.emit(_url_chat, { msg: message });
        }else{
            console.log("not connected..");
        }
    };

    ChatManager.prototype.joinCallback = function(data){
        if(_isconnected){ 
            buildMsgJoin(data);
            if(!initHost){
                loadMessage();
            }
            initHost=true;
        }else{
            console.log("not connected..");
        }
    };  

    ChatManager.prototype.leaveCallback = function(data){
        if(_isconnected){ 
            buildMsgLeave(data); 
        }else{
            console.log("not connected..");
        }
    };  

    ChatManager.prototype.receiveCallback = function(data){
        if(_isconnected){ 
            buildMsg(data)
        }else{
            console.log("not connected..");
        }
    };  

    var chat = new ChatManager();
    chat.init(host, url_join, url_leave, url_chat);    
    chat.join($("#roomid").val(), $("#roomname").val(), $("#userid").val(), $("#username").val(), $("#userimg").val());
    

    function buildMsgJoin(data){
        $("#"+messageListId).append("<div class='join'><span class='name'>" + data + "</span> has joined</div>"); 
        moveListScroll(0.1);
    }

    function buildMsgLeave(data){
        $("#"+messageListId).append("<div class='leave'><span class='name'>" + data + "</span> has leaved</div>"); 
        moveListScroll(0.1);
    }

    var lastUserid="";
    function buildMsg(data){
        messageidx++;
        var msgtype="";
        var isme = false;
        if(data.from.userid==$("#userid").val()){
            msgtype="me";
            isme = true;
        }

        var message = document.createElement("div");
        message.className = "message "+msgtype;
        $("#"+messageListId).append(message);  

        if(!isme && lastUserid!=data.from.userid){
            var profile = document.createElement("span");
            message.appendChild(profile);
            profile.className = "profile";
            
            var img = document.createElement("img");
            profile.appendChild(img);
            img.className="profile-image";
            img.src=data.from.image;

            var name = document.createElement("span");
            profile.appendChild(name);
            name.className="profile-name";
            name.innerHTML = data.from.name +" ( "+data.from.userid+" ) ";
        }
        
        var msgtext = document.createElement("div");
        message.appendChild(msgtext);
        msgtext.className="message-text-group";
        
        var text = document.createElement("div");
        msgtext.appendChild(text);
        text.className="message-text-group-text";
        text.innerHTML = getUrlText(data);
        

        var now = new Date();
        
        var time = document.createElement("time");
        msgtext.appendChild(time);
        time.className="message-text-group-time";
        time.innerHTML = now.toLocaleString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true });

        lastUserid=data.from.userid;
        moveListScroll(0.1);
    }

    function buildUrlPreviewTemplate(data){
        messageidx++;
        var msgtype="";
        var isme = false;
        if(data.from.userid==$("#userid").val()){
            msgtype="me";
            isme = true;
        }

        data.messageidx = messageidx;

        var message = document.createElement("div");
        message.className = "message "+msgtype; 
        message.id = "message_"+messageidx;
        
        lastUserid=data.from.userid
        $("#"+messageListId).append(message);  
        moveListScroll(0.1);
    }

    function buildUrlPreview(data, urlinfo){ 
        var msgtype="";
        var isadded = false; 

        var message = $("#message_"+data.messageidx)[0]; 
        
        var msgtext = document.createElement("div");
        message.appendChild(msgtext);
        msgtext.className="message-text-group preview"; 
        
        var alink = document.createElement("a");
        msgtext.appendChild(alink);
        alink.href = urlinfo.url;
        alink.target = "_blank";

        
        var text = document.createElement("div");
        alink.appendChild(text);
        text.className="message-text-group-text"; 
        
        var img = document.createElement("img");
        if(urlinfo.image!=null){
            isadded=true;
            text.appendChild(img);
            img.className="message-text-group-text-img";
            img.src = urlinfo.image;
        }
        
        var description = document.createElement("div");
        text.appendChild(description);
        description.className="message-text-group-text-description"; 

        var descriptionTitle = document.createElement("div");
        if(urlinfo.title!=null){
            isadded=true;
            description.appendChild(descriptionTitle);
            descriptionTitle.className="title";
            descriptionTitle.innerHTML = urlinfo.title;
        }

        var descriptionText = document.createElement("div");
        if(urlinfo.description!=null){
            isadded=true;
            description.appendChild(descriptionText);
            descriptionText.className="description";
            descriptionText.innerHTML = urlinfo.description;
        }

        var descriptionUrl = document.createElement("div");
        if(urlinfo.url!=null){
            isadded=true;
            description.appendChild(descriptionUrl);
            descriptionUrl.className="url";
            descriptionUrl.innerHTML = urlinfo.url;
        }
        

        var now = new Date();
        
        var time = document.createElement("time");
        if(isadded){
            msgtext.appendChild(time);
            time.className="message-text-group-time";
            time.innerHTML = now.toLocaleString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true });
        }else{
            $("#message_"+data.messageidx).remove();
        }
 
        moveListScroll(0.1);
    }

    function sendMessage(){ 
        if(!chat.isconnected()){ 
            alert("Not connected.");
            return;
        }
        var $sendMsg = $("#sendMsg");
        if($sendMsg.val()==""){
            alert("Input message.");
            return;
        }

        chat.send($sendMsg.val()); 
        $sendMsg.val("");
    }

    function moveListScroll(delay){ 
        setTimeout( function() {
            var height = $("#"+messageListId).height(); 
            $(".chatContainer").scrollTop(height);
        }, 1000*delay ); 
    }
     
    $("#sendMsg").focus(function(){
      moveListScroll(0.5);
    });
    $("#sendMsg").keyup(function(e) { 
        if(e.keyCode==13){ 
            sendMessage();
        }
    });
    $("#sendBtn").click(function(e) {
        e.preventDefault();
        sendMessage();
    });

     
    function getUrlText(data){ 
        var p = /(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?)/gi;
        var result = data.msg.match(p); 
        var remsg = data.msg;
        if(result){
            remsg = data.msg.replace(p,'<a href="$1" class="linkmsg" target="_blank">$1</a>');
            for(var i=0; i<result.length; i++){
                getUrlInfo(data, result[i]);
            } 
        }else{
        }
        return remsg;
    }
    
    function getUrlInfo(message, url){ 
        if(url!=null && url!=""){
            buildUrlPreviewTemplate(message)

            var param = {}; 
            param.url = url; 
    
            $.ajax({
            type: "POST", 
            url: "urlinfo", 
            data: param,
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (data) {
                buildUrlPreview(message, data); 
            },
            error: function (e) {
                var errorData = JSON.parse(JSON.stringify(e));
                console.log(errorData); 
            }
            });
        }
    } 
    
    
    function loadMessage(){ 
        if($("#roomid").val()!=""){
            var param = {}; 
            param.roomid = $("#roomid").val(); 
    
            $.ajax({
                type: "POST", 
                url: "load/past/message", 
                data: param,
                dataType: 'json',
                cache: false,
                timeout: 600000,
                success: function (data) {
                    if(data!=null){
                        for(var i=0; i<data.length; i++){
                            try{
                                var obj = JSON.parse(data[i]);
                                buildMsg(obj);
                            }catch(e){
                                console.log('not json data');
                            }
                        }
                    }
                },
                error: function (e) {
                    var errorData = JSON.parse(JSON.stringify(e));
                    console.log(errorData); 
                }
            });
        }
    } 