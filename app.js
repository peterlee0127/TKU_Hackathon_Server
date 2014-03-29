
/**
 * Module dependencies.
 */

require('./db.js');

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var MongoStore = require('connect-mongo')(express);


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.favicon());

app.use(express.session({
		secret: '1234567890QWERTY',
		cookie  : {
				maxAge  : 24 * 60 *60 *1000    
		},
		store: new MongoStore({
				db: 'sessionstore',
				clear_interval : 3600
		})
}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


function middleHandler(req, res, next) {
    if(req.session.user)
		next();
	else
		res.redirect('login');
}
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', middleHandler,function(req, res){
	res.redirect('/course');
});
app.get('/login', function(req, res){
	res.render('login');
});
app.get('/api/beacon', function(req,res){
	var fs = require('fs');
	fs.readFile('./beacon.json', function(err, string){
		var json = JSON.parse(string);
		res.json(json);
	});
});
app.post('/api/login', routes.login);
app.post('/api/newClass', routes.newClass);
app.get('/api/list', routes.class_List);
app.get('/api/vote_result_list/:id', routes.vote_result_list);
app.get('/api/class/:id', routes.find_Class);
app.get('/api/class/:id/student_list', routes.student_list);
app.get('/client/:id', function(req, res){
	res.render('client', {'id':req.params.id});
});
app.get('/course', routes.course);
app.get('/course1', function(req, res){
	res.render('newClass1',{});
});
app.get('/:id', routes.classPage);


var server =  http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(server);
io.on('connection', function(socket){
	require('./websocket.js').connect(socket);
});