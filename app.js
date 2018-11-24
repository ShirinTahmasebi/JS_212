const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

require('./src/db')();
require('./src/routes')(app);
require('./src/utils/services').errors(app);

module.exports = app;
