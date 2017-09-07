var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

//initalize router module
var router = require('./routes/router');
var myteam = require('./routes/myteam');
var admin = require('./routes/admin');
var player = require('./API/player');
var club = require('./API/club');
var transfer = require('./API/transfer');
var message = require('./API/message');
var app = express();

//initialize authorization module
var auth = require('./routes/auth');
auth.init(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//url
app.use('/', router);
app.use('/myteam', myteam);
app.use('/admin', admin);
app.use('/api/player', player);
app.use('/api/club', club);
app.use('/api/transfer', transfer);
app.use('/api/message', message);

//port number
// const port = 3000;
// //start server
// app.listen(port, () => {
// 	console.log("server start on port " + port);
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
