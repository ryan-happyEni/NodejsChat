
var redisClient = require('../redis/redisclient.js');

function getRoomKey(roomid){
    return "room/s_"+roomid+'_e';
}

function getRoomMemberKey(roomid){
    return "room/s_"+roomid+'_e/member';
}

function getRoomMessageKey(roomid){
    return "room/s_"+roomid+'_e/message';
}

module.exports.makeroom=function(roomid, roomname){
    var obj = {};
    var key = getRoomKey(roomid);
    obj.roomid = roomid;
    obj.roomname = roomname;
    obj.makedate = new Date(); 
     
    redisClient.client().exists(key, function(err, result){
        if(err){
            console.log(err);
        }else{
            if(result==0){
                redisClient.client().hmset(key, obj, function(err){
                    if(err){
                        console.log(err); 
                    }else{ 
                        console.log("make."); 
                    }
                });
            }
        }
    }); 
}

module.exports.join=function(roomid, userid){
    var obj = {};
    var key = getRoomMemberKey(roomid); 
     
    redisClient.client().sadd(key, userid);
}

module.exports.addMessage=function(roomid, msg){
    var key = getRoomMessageKey(roomid); 

    var endDate = new Date(9999, 11, 31, 23, 59, 59);
    var now = new Date();
    var milisec = endDate-now;
    console.log(endDate);     
    console.log(now);
    console.log(milisec)
    redisClient.client().zadd(key, milisec, JSON.stringify(msg));
}

module.exports.getMessages=function(res, roomid){
    var key = getRoomMessageKey(roomid); 

    var endDate = new Date(9999, 11, 31, 23, 59, 59);
    var today   =new Date();
    var pastday   =new Date();
    pastday.setDate(today.getDate()-1) 
    var milisec = endDate - pastday; 
 
    var max = milisec, min = 1, offset = 1, count = 50; 
    /*
    redisClient.client().zrangebyscore(key, min, max, function(err, data){
        if(err){
            res.status(200).json(null);
        }else{ 
            res.status(200).json(data);
        }
    });  
    */
    /*
    
    redisClient.client().zrevrangebyscore(key, max, min, function(err, data){
        if(err){
            res.status(200).json(null);
        }else{ 
            res.status(200).json(data);
        }
    });  

    */

   redisClient.client().zrevrange(key, 1, 100, function(err, data){
        if(err){
            res.status(200).json(null);
        }else{ 
            res.status(200).json(data);
        }
    });   
}