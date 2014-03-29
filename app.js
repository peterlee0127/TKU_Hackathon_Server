
/**
 * Module dependencies.
 */

require('./db.js');

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
// var MongoStore = require('connect-mongo')(express);


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
// app.use(express.session({
// 		secret: '1234567890QWERTY',
// 		cookie  : {
// 				maxAge  : 24 * 60 *60 *1000    
// 		},
// 		store: new MongoStore({
// 				db: 'sessionstore',
// 				clear_interval : 3600
// 		})
// }));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


// function middleHandler(req, res, next) {
//     if(req.session.user)
// 		next();
// 	else
// 		res.redirect('login');
// }
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/api/newClass', routes.newClass);
app.get('/api/list', routes.class_List);
app.get('/api/class/:id', routes.find_Class);
app.get('/client', function(req, res){
	res.render('client', {});
});
app.get('/course', routes.course);
app.get('/course', function(req, res){
	res.render('newClass1',{});
});

var server =  http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(server);
io.on('connection', function(socket){
	require('./websocket.js').connect(socket);
});