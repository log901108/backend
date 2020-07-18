var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();
//redis ex
var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');
//redis ex

//! declare Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/api/auth');
var journalsRouter = require('./routes/api/journals');
var chargeRouter = require('./routes/api/charge');
var paymentRouter = require('./routes/api/payment');
var ledgerRouter = require('./routes/api/ledger');
var roomRouter = require('./routes/api/room');
var tenantRouter = require('./routes/api/tenant');

var mjwtdecode = require('./routes/api/auth/middle/mjwtdecode');
var mjwtaccesstoken = require('./routes/api/auth/middle/maccesstoken');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(mjwtdecode); //set req.user at this middleware
app.use(mjwtaccesstoken);

//redis ex
app.use(function (req, res, next) {
  req.cache = client;
  next();
});
//

//! Routers use
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/journals', journalsRouter);
app.use('/api/charge', chargeRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/ledger', ledgerRouter);
app.use('/api/room', roomRouter);
app.use('/api/tenant', tenantRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
