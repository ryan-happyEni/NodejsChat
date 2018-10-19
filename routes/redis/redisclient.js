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



module.exports.redisKeys=function(res, search){
    redisClient.keys(search, function (err, keys) {
        if(err){
            res.status(200).json(false);
        }else{
            res.status(200).json(keys);
        }
    });     
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

module.exports.redisSet=function(res, expierSeconds, key, value){
    if(expierSeconds!=null && expierSeconds>0){
        redisClient.setex(key, expierSeconds, value, function(err){
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