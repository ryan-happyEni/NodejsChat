var express = require('express');  

var router = express.Router();

var redisClient = require('./redisclient.js');

 
router.get('/main', function(req, res, next) {
    res.render('redis/main');
});

router.get('/navigator', function(req, res, next) {
    res.render('redis/navigator');
});
 
router.get('/example:pageNum', function(req, res, next) { 
    res.render('redis/example'+req.params.pageNum);
}); 

router.post('/info', function(req, res, next) {
    try {      
        redisClient.redisInfo(res); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/keys', function(req, res, next) {
    var search = req.body.search;
    try {      
        redisClient.redisKeys(res, search); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/key/info', function(req, res, next) {
    var search = req.body.key;
    try {      
        redisClient.redisKeyInfo(res, search); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/key/data/size', function(req, res, next) {
    var key = req.body.key;  
    var type = req.body.type;  
    try {        
        if(type=="zset"){
            redisClient.redisZcard(res, key); 
        }else if(type=="set"){
            redisClient.redisScard(res, key); 
        }else if(type=="list"){
            redisClient.redisLlen(res, key); 
        }else if(type=="hash"){
            redisClient.redisHlen(res, key); 
        }else{  
            redisClient.client().exists(key, function(err, rr){ 
                if(err){
                    res.status(200).json(0);
                }else{
                    res.status(200).json(rr); 
                }
            }); 
        }
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/del', function(req, res, next) {
    var key = req.body.key;
    try {      
        redisClient.redisDel(res, key); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/del/:type', function(req, res, next) {
    var key = req.body.key;
    try {      
        var type = req.params.type;
        if(type=="hash"){
            var field = req.body.field;
            redisClient.redisHdel(res, key, field); 
        }else if(type=="set"){
            var value = req.body.value;
            redisClient.redisSrem(res, key, value); 
        }else if(type=="zset"){
            var value = req.body.value;
            redisClient.redisZrem(res, key, value); 
        }else if(type=="list"){
            var value = req.body.value;
            var count = req.body.count;
            redisClient.redisZrem(res, key, value, count); 
        }else{
            res.status(200).json(false);
        }
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/set', function(req, res, next) {
    var key = req.body.key;
    var value = req.body.value; 
    try {      
        var expireSeconds = 60*60*24*30;
        redisClient.redisSet(res, expireSeconds, key, value); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/get', function(req, res, next) {
    var key = req.body.key; 
    try {      
        redisClient.redisGet(res, key); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/hmset', function(req, res, next) {
    var key = req.body.key;
    var value = {}; 
    try {      
        for (var k in req.body) {
            if(k.indexOf('value[')==0){
                var kx = k.substring(6, k.length-1);
                value[kx] = req.body[k];
            }  
        }
        redisClient.redisHMSet(res, key, value); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/hgetall', function(req, res, next) {
    var key = req.body.key; 
    try {      
        redisClient.redisHGetall(res, key); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/rpush', function(req, res, next) {
    var key = req.body.key;
    var value = []; 
    try {      
        for (var k in req.body) {
            if(k.indexOf('value[')==0){
                var kx = k.substring(6, k.length-1);
                value[value.length] = req.body[k];
            }  
        }

        console.log(value);

        redisClient.redisRpush(res, key, value); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/lrange', function(req, res, next) {
    var key = req.body.key; 
    var start = req.body.start;
    var end = req.body.end;
    try {      
        redisClient.redisLrange(res, key, start, end);
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/sadd', function(req, res, next) {
    var key = req.body.key;
    var value = []; 
    try {      
        for (var k in req.body) {
            if(k.indexOf('value[')==0){
                var kx = k.substring(6, k.length-1);
                value[value.length] = req.body[k];
            }  
        }

        console.log(value);

        redisClient.redisSadd(res, key, value); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/smembers', function(req, res, next) {
    var key = req.body.key; 
    try {      
        redisClient.redisSmembers(res, key);
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/zadd', function(req, res, next) {
    var key = req.body.key;
    var value = []; 
    try {       
        for (var k in req.body) {
            if(k.indexOf('value[')==0){
                var kx = k.substring(k.indexOf("][")+2, k.length-1);
                var info = {};
                info.priority=kx;
                info.value=req.body[k];
                value[value.length] = info;
            }  
        }

        console.log(value);

        redisClient.redisZadd(res, key, value); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/zrange', function(req, res, next) {
    var key = req.body.key; 
    var start = req.body.start;
    var end = req.body.end;
    try {      
        redisClient.redisZrange(res, key, start, end);
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/zcard', function(req, res, next) {
    var key = req.body.key;  
    try {       
        redisClient.redisZcard(res, key); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

module.exports = router;