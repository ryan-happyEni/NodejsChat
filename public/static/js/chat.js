

function ChatManager(){ 
    _socket = null;
    _roomid = null;
    _userid = null;
    _username = null;
    _userimg = null;
    _isconnected = false;
    _receive=function(data){
        console.log(data);
    }
    _url_join = 'join';
    _url_leave = 'leave';
    _url_chat = 'chat';
}

ChatManager.prototype.init = function(host, url_join, url_leave, url_chat){ 
    _socket = io.connect(host);  
    if(url_join!=null){
        _url_join = url_join;
    }
    if(url_leave!=null){
        _url_leave = url_leave;
    }
    if(url_chat!=null){
        _url_chat = url_chat;
    }
    console.log("socket io host ["+host+"] "); 
};  

ChatManager.prototype.isconnected = function(){ 
    return _isconnected;  
}; 

ChatManager.prototype.join = function(roomid, roomname, userid, username, userimg){  
    if(_socket != null){
        _roomid = roomid;
        _roomname = roomname;
        _userid = userid;
        _username = username;
        _userimg = userimg;
        _socket.emit(_url_join, { 
            id: _roomid,
            roomname: _roomname,
            name: _username,
            userid: _userid,
            image: _userimg,
        }); 

        var manager = this;
            
        // 서버로부터의 메시지가 수신되면
        _socket.on(_url_join, function(data) {
            manager.joinCallback(data);
        });
            
        // 서버로부터의 메시지가 수신되면
        _socket.on(_url_leave, function(data) {
            manager.leaveCallback(data);
        });
    
        // 서버로부터의 메시지가 수신되면
        _socket.on(_url_chat, function(data) { 
            manager.receiveCallback(data);
        });
        
        _isconnected = true; 
        console.log("connected.."); 
    }else{ 
        console.log("socket.io not init.."); 
    } 
}; 

ChatManager.prototype.send = function(message){ 
    if(_isconnected){
        _socket.emit(_url_chat, { msg: message });
    }else{
        console.log("not connected..");
    }
};

ChatManager.prototype.joinCallback = function(data){
    if(_isconnected){ 
        $(".chatList").append("<div><strong>" + data + "</strong> has joined</div>"); 
    }else{
        console.log("not connected..");
    }
};  

ChatManager.prototype.leaveCallback = function(data){
    if(_isconnected){ 
        $(".chatList").append("<div><strong>" + data + "</strong> has leaved</div>"); 
    }else{
        console.log("not connected..");
    }
};  

ChatManager.prototype.receiveCallback = function(data){
    if(_isconnected){ 
        $(".chatList").append("<div>" + data.msg + " : from <strong>" + data.from.name +"("+data.from.userid+ ")</strong></div>");  
    }else{
        console.log("not connected..");
    }
};  