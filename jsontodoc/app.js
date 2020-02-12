const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const jsonToDocRouter = require('./routes/json-to-doc');
const imageCompress = require('./routes/image-compress');

const app = express();

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb' ,extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

app.use('/', indexRouter);
app.use('/json', jsonToDocRouter);
app.use('/image-compress', imageCompress);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;
