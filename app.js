var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var cors = require("cors");

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/blog-cms',{
    promiseLibrary: require("bluebird"),
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>console.log("Connection Successful")).catch((err)=>console.error(err));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
