let
    redis     = require('redis'),    
    redisClient    = redis.createClient({
        port      : 6379,               // replace with your port
        host      : '127.0.0.1',        // replace with your hostanme or IP address
        //password  : 'your password',    // replace with your password
        // optional, if using SSL
        // use `fs.readFile[Sync]` or another method to bring these values in
        /*
        tls       : {
            key  : stringValueOfKeyFile,  
            cert : stringValueOfCertFile,
            ca   : [ stringValueOfCaCertFile ]
        }
        */       
    }); 

module.exports.client=function(){
    return redisClient;
}

module.exports.redisInfo=function(res){
    redisClient.info(function(err, info){
        if(err){
            res.status(200).json(null);
        }else{
            res.status(200).json(info);
        }
    });     
}

module.exports.redisKeys=function(res, search){
    redisClient.keys(search, function (err, keys) {
        if(err){
            res.status(200).json(false);
        }else{ 
            res.status(200).json(keys);
        }
    });     
}

module.exports.redisKeyInfo=function(res, search){  
    redisClient.type(search, function(err, value){
        if(err){
            res.status(200).json(null);
        }else{
            res.status(200).json(value);
        }
    });
}

module.exports.redisExists=function(res, key){
    redisClient.exists(key, function(err, rr){

        if(err){
            res.status(200).json(false);
        }else{
            if(rr==0){
                res.status(200).json(false);
            }else{
                res.status(200).json(true);
            }
        }
    });

    return result;
}

module.exports.redisDel=function(res, key, value){
    redisClient.del(key, function(err){
        if(err){
            res.status(200).json(false);
        }else{
            res.status(200).json(true);
        }
    });
}

module.exports.redisHdel=function(res, key, field){
    redisClient.hdel(key, field, function(err){
        if(err){
            res.status(200).json(false);
        }else{
            res.status(200).json(true);
        }
    });
}

module.exports.redisSrem=function(res, key, value){
    redisClient.srem(key, value, function(err){
        if(err){
            res.status(200).json(false);
        }else{
            res.status(200).json(true);
        }
    }); 
}

module.exports.redisZrem=function(res, key, value){
    redisClient.zrem(key, value, function(err){
        if(err){
            res.status(200).json(false);
        }else{
            res.status(200).json(true);
        }
    }); 
}

module.exports.redisLrem=function(res, key, value, count){ 
    redisClient.lrem(key, count, value, function(err){
        if(err){
            res.status(200).json(false);
        }else{
            res.status(200).json(true);
        }
    });     
}

module.exports.redisSet=function(res, expireSeconds, key, value){
    if(expireSeconds!=null && expireSeconds>0){
        redisClient.setex(key, expireSeconds, value, function(err){
            if(err){
                res.status(200).json(false);
            }else{
                res.status(200).json(true);
            }
        });
    }else{
        redisClient.set(key, value, function(err){
            if(err){
                res.status(200).json(false);
            }else{
                res.status(200).json(true);
            }
        });
    }
}

module.exports.redisGet=function(res, key){
    redisClient.get(key, function(err, value){
        if(err){
            res.status(200).json(null);
        }else{
            var resultJSON = {}
            try{ 
                resultJSON = JSON.parse(value); 
            }catch(e){
                resultJSON[key]=value; 
            }
            res.status(200).json(resultJSON);
        }
    });
} 

module.exports.redisHMSet=function(res, key, obj){  
    try{ 
        redisClient.hmset(key, obj, function(err){
            if(err){
                console.log(err);
                res.status(200).json(false); 
            }else{
                res.status(200).json(true); 
            }
        }); 
    }catch(e){
        res.status(200).json(null);
    }
} 

module.exports.redisHGetall=function(res, key){
    try{ 
        redisClient.hgetall(key, function(err, obj){
            if(err){
                console.log(err);
                res.status(200).json(null);
            }else{ 
                res.status(200).json(obj);
            }
        });
    }catch(e){
        res.status(200).json(null);
    }
} 

module.exports.redisRpush=function(res, key, arr){
    try{ 
        if(arr!=null && arr.length>0){
            var multi = redisClient.multi();
            for(var i=0; i<arr.length; i++){
                multi.rpush(key, arr[i]);
            }
            multi.exec(function(err, results) {
                if(err){
                    console.log(err);
                    res.status(200).json(false); 
                }else{
                    res.status(200).json(true); 
                }
            });
        } 
    }catch(e){
        res.status(200).json(null);
    }
} 

module.exports.redisLrange=function(res, key, start, end){
    try{ 
        redisClient.lrange(key, start, end, function(err, set){
            if(err){
                console.log(err);
                res.status(200).json(null);
            }else{ 
                res.status(200).json(set);
            }
        });
    }catch(e){
        res.status(200).json(null);
    }
} 

module.exports.redisSadd=function(res, key, arr){
    try{ 
        if(arr!=null && arr.length>0){
            var multi = redisClient.multi();
            for(var i=0; i<arr.length; i++){
                multi.sadd(key, arr[i]);
            }
            multi.exec(function(err, results) {
                if(err){
                    console.log(err);
                    res.status(200).json(false); 
                }else{
                    res.status(200).json(true); 
                }
            });
        } 
    }catch(e){
        res.status(200).json(null);
    }
} 

module.exports.redisSmembers=function(res, key){
    try{ 
        redisClient.smembers(key, function(err, set){
            if(err){
                console.log(err);
                res.status(200).json(null);
            }else{ 
                res.status(200).json(set);
            }
        });
    }catch(e){
        res.status(200).json(null);
    }
} 

module.exports.redisZadd=function(res, key, arr){
    try{ 
        if(arr!=null && arr.length>0){
            var multi = redisClient.multi();
            for(var i=0; i<arr.length; i++){
                //multi.zadd(key, arr[i].priority, JSON.stringify(arr[i].value));
                console.log(arr[i])
                multi.zadd(key, arr[i].priority, arr[i].value);
            }
            multi.exec(function(err, results) {
                if(err){
                    console.log(err);
                    res.status(200).json(false); 
                }else{
                    res.status(200).json(true); 
                }
            });
        } 
    }catch(e){
        res.status(200).json(null);
    }
} 

module.exports.redisZrange=function(res, key, start, end){
    try{ 
        redisClient.zrange(key, start, end, function(err, set){
            if(err){
                console.log(err);
                res.status(200).json(null);
            }else{ 
                res.status(200).json(set);
            }
        });
    }catch(e){
        res.status(200).json(null);
    }
} 

module.exports.redisZcard=function(res, key){
    try{ 
        redisClient.zcard(key, function(err, reply){
            if(err){
                console.log(err);
                res.status(200).json(0);
            }else{ 
                res.status(200).json(reply);
            }
        });
    }catch(e){
        res.status(200).json(0); 
    }
} 

module.exports.redisScard=function(res, key){
    try{  
        redisClient.scard(key, function(err, reply){
            if(err){
                console.log(err);
                res.status(200).json(0);
            }else{ 
                res.status(200).json(reply);
            }
        });
    }catch(e){
        res.status(200).json(0); 
    }
} 

module.exports.redisLlen=function(res, key){
    try{  
        redisClient.llen(key, function(err, reply){
            if(err){
                console.log(err);
                res.status(200).json(0);
            }else{ 
                res.status(200).json(reply);
            }
        }); 
    }catch(e){
        res.status(200).json(0); 
    }
} 

module.exports.redisHlen=function(res, key){
    try{  
        redisClient.hlen(key, function(err, reply){
            if(err){
                console.log(err);
                res.status(200).json(0);
            }else{ 
                res.status(200).json(reply);
            }
        });  
    }catch(e){
        res.status(200).json(0); 
    }
} 

module.exports.redisKeycount=function(res, key){
    try{  
        redisClient.ZSCAN
        redisClient.hlen(key, function(err, reply){
            if(err){
                console.log(err);
                res.status(200).json(0);
            }else{ 
                res.status(200).json(reply);
            }
        });  
    }catch(e){
        res.status(200).json(0); 
    }
} 