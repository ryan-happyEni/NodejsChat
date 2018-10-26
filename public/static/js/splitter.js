function initSplitter(idContainer, idA, idB, idSplitter){ 
    var resizableA = parseInt($(idA).width()) + 30;
    var moveon = false;
    var leftMin=200;
    var rightMin=400;
    if(resizableA>300){
        resizableA=300;
    }
    $(idSplitter).mousedown(function(e){
        moveon = true; 
    });

    $(document.body).mouseup(function(e){
        moveon = false; 
    });

    $(document.body).mousemove(function(e){
        if(moveon){
            var mouseX = event.pageX; 
            var offset = $(idContainer).offset(); 
            if(mouseX>leftMin && mouseX < ($(idContainer).width()+offset.left-rightMin)){
                var aW = mouseX - 30;       
                var bW = $(idContainer).width() - aW - 50 + 29;          
                $(idA).css({width : aW});  
                $(idB).css({width : bW});  
            }
        }
    });
    
    var bW = $(idContainer).width() - resizableA - 50 + 29 - 16;    
    $(idA).css({width : resizableA});   
    $(idB).css({width : bW}); 
    var resizableB = parseInt($(idB).width());

    var defaultWidth = $(document.body).width();
    var lastWidth=defaultWidth; 
    if(defaultWidth>rightMin+leftMin+68){
        window.onresize=function(e){
            var bwidth = $(document.body).width();
            var gab = bwidth-defaultWidth;
            var aW = $(idA).width(); 
            var bW = bwidth-aW - 80; 

            if(bW>rightMin){ 
                $(idB).css({width : bW}); 
                lastWidth = bwidth; 
            }else{  
                var gab = bwidth-lastWidth;
                var aW = bwidth-rightMin-80; 
                if(aW>leftMin){
                    $(idA).css({width : aW});   
                }
            }  
            if(bwidth < rightMin+leftMin+68){
                $(idSplitter).hide();
                $(idA).css({width : "100%"}); 
                $(idB).css({width : "100%"}); 
            }else{
                $(idSplitter).show();
            }
        }
    }else{
        $(idSplitter).hide();
        $(idA).css({width : "100%"}); 
        $(idB).css({width : "100%"}); 
    }
}