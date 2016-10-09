var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var util = require('util');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var db = require('monk')('mongodb://david:1234@ds053176.mlab.com:53176/dcsm-nodeblog');
var multer = require('multer');
var flash = require('connect-flash');


var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var categories = require('./routes/categories');

var app = express();

app.locals.moment = require('moment');

app.locals.truncateText = function (text, lenght) {
    var truncatedText = text.substring(0, lenght);
    return truncatedText;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Using Multer for file uploads.
app.use(multer({dest:'./public/images/uploads/'}).single('mainimage'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// this line must be immediately after express.bodyParser()!
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));


app.use(cookieParser());


// required for passport session
app.use(session({
    secret: 'secrettexthere',
    saveUninitialized: false,
    resave: true,
}));

app.use(express.static(path.join(__dirname, 'public')));




// connect-flash
app.use(flash());

app.use(function(req, res, next) {
    res.locals.messages = req.flash();
    next();
});


// make our db accesible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);
app.use('/categories', categories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
