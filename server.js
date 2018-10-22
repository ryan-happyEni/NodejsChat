var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser'); 

var indexRouter = require('./routes/index'); 
var chatRouter = require('./routes/chat/chat'); 
var redisRouter = require('./routes/redis/redis'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));   

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use('/', indexRouter); 
app.use('/chat', chatRouter);
app.use('/redis', redisRouter); 




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var server = app.listen(8080, function () {
    console.log('Dev app listening on port 80!');
});
 




var chatManager = require('./routes/chat/chatmanager.js');

var io = require('socket.io')(server); 
var chatnsp = io.of('/chatio');
chatnsp.on('connection', function(socket) {  
    socket.on('join', function(data) {
        //console.log('Client logged-in:\n id:' + data.id + '\n name: ' + data.name + '\n userid: ' + data.userid); 
        socket.roomid = data.id;
        socket.roomname = data.roomname;
        socket.name = data.name;
        socket.userid = data.userid;
        socket.image = data.image;
        

        console.log("join!!!!!!!!!!!!!!!!!!!!!!")
        chatManager.makeroom(socket.roomid, socket.roomname);
        chatManager.join(socket.roomid, socket.userid);
        console.log("joined~~~~~~~~~~~~~~~");

        socket.join(socket.roomid); 
        //chatnsp.emit('join', data.name ); 
        chatnsp.to(socket.roomid).emit('join', data.name);
    });
 
    socket.on('chat', function(data) {
        //console.log('Message from %s - %s: %s', socket.id, socket.name, data.msg);
        var msg = {
            from: {
                id: socket.roomid,
                name: socket.name,
                userid: socket.userid,        
                image: socket.image
            },
            msg: data.msg
        };

        //socket.broadcast.emit('chat', msg);
        // socket.emit('chat', msg);
        //chatnsp.emit('chat', msg);
        chatnsp.to(socket.roomid).emit('chat', msg);
        chatManager.addMessage(socket.roomid, msg);
    });
 
    socket.on('forceDisconnect', function() {
        socket.disconnect();
    })

    socket.on('disconnect', function() {
        socket.leave(socket.roomid);
        chatnsp.to(socket.roomid).emit('leave', socket.name);
        //console.log('user disconnected: ' + socket.name);
    });
});


var debug = require('debug')('nodejschatserver:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
 
