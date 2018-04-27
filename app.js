var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var hbs = require('hbs')
var AWS = require('aws-sdk');


var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var changepassRouter = require('./routes/changepass');
var forgotpassRouter = require('./routes/forgotpass');
var foldersRouter = require('./routes/folders');
var contentsRouter = require('./routes/contents');
var uploadRouter = require('./routes/upload');
var logoutRouter = require('./routes/logout');
var messagesRouter = require('./routes/messages');

global.fetch = require('node-fetch');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secretString'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(require('connect-flash')());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)();
  next();
});

//Global Variables
app.locals.UserPoolId = 'us-west-2_sFuJmXBam';
app.locals.ClientId = '7v3io0egl88bujb261ecdjiubn';
app.locals.IdentityPoolId = 'us-west-2:e58465a5-5e9a-4842-a27d-693c5bde4553';
AWS.config.update({region: 'us-west-2'});

//Routes
app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/folders', foldersRouter);
app.use('/', contentsRouter);
app.use('/', uploadRouter);
app.use('/changepass', changepassRouter);
app.use('/forgotpass', forgotpassRouter);
app.use('/logout', logoutRouter);
app.use('/messages', messagesRouter);

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

app.listen(3000, function () {
  console.log('Example app listening on port 5001!')
})

module.exports = app;
