var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var signup = require('./routes/signup');
var polls = require('./routes/polls');
var myaccount = require('./routes/myaccount');
var flash = require('express-flash');
var methodOverride = require("method-override");
const projectRoot = path.resolve(__dirname, '../')

  http = require('http');
var app = express();
app.io = require('socket.io')();

var passport = require('passport');
var authentification = require('./services/authentification');
app.use(session({
    secret: '681433da-d3f4-4a62-9dbd-58c6f73d9f0f',
    saveUninitialized: true,
    resave: true,
    cookie: {
        secure: false,
        maxAge: 6000000
    }
}));
app.use(flash());
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
passport.use(authentification.interpollLocalStrategy());
app.use(passport.initialize());
app.use(passport.session());
const verifyAuth = (req, res, next) => {
   res.locals.userLogged = false;
   console.log(req.originalUrl);
   if (req.originalUrl === '/signup' ||req.originalUrl === '/login' ) {
       return next();
   }
   if (req.get('authorization') === '681433da-d3f4-4a62-9dbd-58c6f73d9f0f') {
       res.locals.userLogged = true;
       return next();
   }
   if (req.isAuthenticated()) {
       res.locals.userLogged = true;
       return next();
   }
   if (req.accepts('text/html')) {
        return res.redirect('/login');
   }
   if (req.accepts('application/json')) {
        res.set('Location', '/login');
        return res.status(401).send({err: 'Vous devez être connecté'});
   }
};
app.all('/polls', verifyAuth);
app.all('/polls/new', verifyAuth);
app.all('/polls/edit/*', verifyAuth);
app.all('/', verifyAuth);
app.all('/myaccount', verifyAuth);
app.all('/login', verifyAuth);
app.all('/signup', verifyAuth);
app.all('/logout', verifyAuth);
app.use('static', express.static(projectRoot + '/public'));
app.use('dist', express.static(__dirname));

// Form Builder
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/jqueryui', express.static(__dirname + '/node_modules/jqueryui'));
app.use('/formbuilder', express.static(__dirname + '/node_modules/formBuilder/dist'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use('/', index);
app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/polls', polls);
app.use('/myaccount', myaccount);


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

app.io.on( "connection", function( socket )
{
    console.log( "A user connected" );
    socket.on('user', function (user) {
    socket_user = user;
    sockets.emit('join', user);
  });
});

module.exports = app;
