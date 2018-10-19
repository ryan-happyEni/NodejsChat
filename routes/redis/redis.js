var express = require('express');  

var router = express.Router();

var redisClient = require('./redisclient.js');

 
router.get('/main', function(req, res, next) {
    res.render('redis/main');
});
 
router.get('/example1', function(req, res, next) {
    res.render('redis/example1');
});
 
router.get('/example2', function(req, res, next) {
    res.render('redis/example2');
});
 
router.get('/example3', function(req, res, next) {
    res.render('redis/example3');
});
 
router.get('/example4', function(req, res, next) {
    res.render('redis/example4');
});
 
router.get('/example5', function(req, res, next) {
    res.render('redis/example5');
});
 
router.get('/example6', function(req, res, next) {
    res.render('redis/example6');
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

router.post('/del', function(req, res, next) {
    var key = req.body.key;
    try {      
        redisClient.redisDel(res, key); 
    } catch (error) {
        console.log(error);
        res.send(500);
    } 
});

router.post('/set', function(req, res, next) {
    var key = req.body.key;
    var value = req.body.value; 
    try {      
        redisClient.redisSet(res, key, value); 
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
        console.log(req.body)
        console.log("######################################")
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

module.exports = router;