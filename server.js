const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jade = require('jade');

const view = require('./routes/view');
const api = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.use('/fb*', view);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.code = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  if (err.code === undefined) {
    err.code = 500;
  }

  console.error(err);

  if (err.message === undefined || err.code === 500) {
    err.message = 'Internal server error';
  }

  let obj = {
    message: err.message
  };

  res.status(err.code).json(obj);
});

module.exports = app;
