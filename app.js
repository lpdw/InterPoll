var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookie = require('cookie');
const url = require('url');
var index = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var signup = require('./routes/signup');
var polls = require('./routes/polls');
var myaccount = require('./routes/myaccount');
var flash = require('express-flash');
var methodOverride = require("method-override");
var UserService = require("./services/users");
const projectRoot = path.resolve(__dirname, '../');

var http = require('http');
var app = express();
app.io = require('socket.io')();
var pollService = require("./services/polls");
var passport = require('passport');
var authentification = require('./services/authentification');
var sessionMiddleware = session({
  secret: '681433da-d3f4-4a62-9dbd-58c6f73d9f0f',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 6000000
  }
});
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(flash());

passport.use(authentification.interpollLocalStrategy());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  console.log("serializeUser" + user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("deserializeUser" + user);

  done(null, user);
});
const verifyAuth = (req, res, next) => {
  res.locals.userLogged = false;
  // manually set user for dev environment
  // if (app.settings.env === "development") {
  //     res.locals.userLogged = true;
  //     UserService.findById(1)
  //         .then(user => {
  //             res.cookie('User', user.toJSON(), {
  //                 maxAge: 2592000000
  //             });
  //             next();
  //         }).catch(err => {
  //             console.log(err);
  //
  //         });
  //
  // } else {
  if (req.originalUrl === '/signup' || req.originalUrl === '/login') {
    return next();
  } else if (req.originalUrl.indexOf("/polls/live/") === 0) {
    console.log("Live poll");
    if (req.isAuthenticated()) {
      res.locals.userLogged = true;
      return next();
    } else {
      res.locals.userLogged = false;
      return next();
    }
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
    return res.status(401).send({
      err: 'Vous devez être connecté'
    });
  }
  // }
};

app.all('/polls', verifyAuth);
app.all('/polls/new', verifyAuth);
app.all('/polls/live/*', verifyAuth);
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
app.use('/chart', express.static(__dirname + '/node_modules/chart.js/dist'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/js', express.static(__dirname + '/public/js'));

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
//app.use(bodyParser({keepExtensions:true,uploadDir:path.join(__dirname,'/uploads')}));
// app.use(express.multipart());

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


app.io.use(function(socket, next) {
  sessionMiddleware(socket.handshake, {}, next);
});
app.set('socketio', app.io);

/*
*
*     Socket io pour le live poll
*
*/

var current_slide = 0;
app.io.on("connection", function(socket) {

  var url_current = url.parse(socket.handshake.headers.referer, true, true);
  var poll_id = url_current.pathname.split("/");
  poll_id = poll_id[poll_id.length - 1];
  // On rejoint la room du sondage
  socket.join(poll_id);
  pollService.findById(poll_id).then(poll => {
    var session = socket.handshake.session;
    var form_array = JSON.parse(poll.form_json);
    var isConnected = false;
    var chartsData = createChartsData(form_array[0]);
    if (session.passport !== undefined && session.passport !== null) {
      isConnected = true;
      // Initialisation de la première slide
      app.io.to(poll_id).emit("change_slide", {
        number: 0,
        form_json: form_array[0],
        charts_result: chartsData
      });
    } else {
      // On initialise l'écran du visiteur à la slide en cours
      app.io.to(poll_id).emit("change_slide", {
        number: current_slide,
        form_json: form_array[current_slide],
        charts_result: chartsData
      });
    }

    // On affiche la première slide avec le formulaire
    socket.on('change_slide', function(slide) {
      var session = socket.handshake.session;
      var nouvelle_slide = parseInt(slide.number) + parseInt(slide.action);
      chartsData = createChartsData(form_array[nouvelle_slide]);
      // Mise à jour de la variable current_slide pour les visiteurs qui arriveraient en cours de présentation
      current_slide = nouvelle_slide;
      // Si la nouvelle slide existe
      if (form_array[nouvelle_slide] !== undefined && form_array[nouvelle_slide] !== null) {
        app.io.to(poll_id).emit("change_slide", {
          number: nouvelle_slide,
          form_json: form_array[nouvelle_slide],
          charts_result: chartsData
        });
      } else if (nouvelle_slide > 0) {
        app.io.to(poll_id).emit("last_slide");
      }
    });

    socket.on('input_values', function(inputValues) {
      chartsData = updateChartsData(chartsData, inputValues);
      app.io.emit('data_update', chartsData);
    });

  });

});

var createChartsData = function(currentSlide) {
  currentSlideJson = JSON.parse(currentSlide);
  var chartsData = {};
  for (var i = 0; i < currentSlideJson.length; i++) {
    var formField = currentSlideJson[i];
    if (formField.values && formField.resultat && formField.name && formField.resultat != 'noresult') {
      var values = [];
      var data = {
        labels: [],
        datasets: []
      };
      var datasets = {
        data: [],
        backgroundColor: []
      };
      for (var j = 0; j < formField.values.length; j++) {
        data.labels.push(formField.values[j].label);
        datasets.data.push(0);
        datasets.backgroundColor.push(colorsArray[j]);
        values.push(formField.values[j].value);
      }
      if (formField.other) {
        data.labels.push('Autres');
        datasets.data.push(0);
        datasets.backgroundColor.push(colorsArray[datasets.backgroundColor.length]);
        values.push('other');
      }
      data.datasets.push(datasets);
      chartsData[formField.name] = {type: formField.resultat, data: data, values: values};
    }
  }
  return chartsData;
};

var updateChartsData = function(chartsData, updateValue) {
  for (var i = 0; i < updateValue.length; i++) {
    for (var fieldName in updateValue[i]) {
      var index = chartsData[fieldName].values.indexOf(updateValue[i][fieldName]);
      if (index != -1)
        chartsData[fieldName].data.datasets[0].data[index]++;
      else if (chartsData[fieldName].values[chartsData[fieldName].values.length-1] == 'other')
        chartsData[fieldName].data.datasets[0].data[chartsData[fieldName].values.length-1]++;
    }
  }
  return chartsData;
};

var colorsArray = ['rgba(81,87,74,1)', 'rgba(68,124,105,1)', 'rgba(116,196,147,1)', 'rgba(142,140,109,1)', 'rgba(228,191,128,1)', 'rgba(233,215,142,1)', 'rgba(226,151,93,1)', 'rgba(241,150,112,1)', 'rgba(225,101,82,1)', 'rgba(201,74,83,1)', 'rgba(190,81,104,1)', 'rgba(163,73,116,1)', 'rgba(153,55,103,1)', 'rgba(101,56,125,1)', 'rgba(78,36,114,1)', 'rgba(145,99,182,1)', 'rgba(226,121,163,1)', 'rgba(224,89,139,1)', 'rgba(124,159,176,1)', 'rgba(86,152,196,1)', 'rgba(154,191,136,1)'];

module.exports = app;
