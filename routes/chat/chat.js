var express = require('express'); 
var request = require('request');
var cheerio = require('cheerio'); 
 
var router = express.Router();

var chatManager = require('./chatmanager.js');

 
router.get('/list', function(req, res, next) {
    res.render('chat/list');
});
 
router.post('/room', function(req, res, next) {
    var data = {};
    data.roomid = req.body.roomid;
    data.roomname = req.body.roomname;
    data.userid = req.body.userid;
    data.username = req.body.username;
    data.userimg = req.body.userimg;

    res.render('chat/room', data);
}); 
 
router.post('/load/past/message', function(req, res, next) {
    var data = {};
    data.roomid = req.body.roomid;

    chatManager.getMessages(res, data.roomid);
}); 

router.post('/urlinfo', function(req, res, next) {
    var url = req.body.url;
    console.log(url)
    try {     
        var options = {
            uri: url,
            headers: {
                'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; IPMS/A640400A-14D460801A1-000000426571; TCO_20110131100426; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; Tablet PC 2.0)'   
            },
            encoding: 'utf8'
        };
        request(options, function(err, response, html){            
            try {   
                if (err) {throw err};      
                var $ = cheerio.load(html);
    
                var info = {};
                $("meta[property='og:site_name']").each(function(){
                    try { 
                        console.log($(this).attr("content"));
                        info.site_name = $(this).attr("content");
                    }catch(error){
                        console.log(error);
                    }
                });
                
                $("meta[property='og:title']").each(function(){
                    try { 
                        console.log($(this).attr("content"));
                        info.title = $(this).attr("content");
                    }catch(error){
                        console.log(error);
                    }
                });
                
                $("meta[property='og:description']").each(function(){
                    try { 
                        console.log($(this).attr("content"));
                        info.description = $(this).attr("content");
                    }catch(error){
                        console.log(error);
                    }
                });
                
                $("meta[property='og:url']").each(function(){
                    try { 
                        console.log($(this).attr("content"));
                        info.url = $(this).attr("content");
                    }catch(error){
                        console.log(error);
                    }
                });
                
                $("meta[property='og:image']").each(function(){
                    try { 
                        console.log($(this).attr("content"));
                        info.image = $(this).attr("content");
                    }catch(error){
                        console.log(error);
                    }
                }); 
                console.log(info)
    
                res.json(info); 
            }catch(error){
                console.log(error);
            }
        });   
    } catch (error) {
        res.send(500);
    } 
});

module.exports = router;
