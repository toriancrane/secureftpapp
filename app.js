var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var session = require('express-session')
var logger = require('morgan');
//var handlebars = require('express-handlebars')

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var changepassRouter = require('./routes/changepass');
var forgotpassRouter = require('./routes/forgotpass');
var foldersRouter = require('./routes/folders');
var logoutRouter = require('./routes/logout');
var messagesRouter = require('./routes/messages');

global.fetch = require('node-fetch');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secretString'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

//Routes
app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/folders', foldersRouter);
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

module.exports = app;
