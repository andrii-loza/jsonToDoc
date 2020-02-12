var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var jsonToDocRouter = require('./routes/json-to-doc');
var imageCompress = require('./routes/image-compress');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/json', jsonToDocRouter);
app.use('/image-compress', imageCompress);

module.exports = app;
