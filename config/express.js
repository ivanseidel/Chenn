/**
* Module dependencies.
*/

var express = require('express');
var session = require('express-session');
var compression = require('compression');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var csrf = require('csurf');
// var swig = require('swig');

var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var winston = require('winston');
// var helpers = require('view-helpers');
var pkg = require('../package.json');

function init(app, next){
	var server = app.server = express();
	app.httpServer = require('http').Server(server);
	var config = app.config;
	var env = app.config.env;
	var passport = app.passport;

	// Compression middleware (should be placed before express.static)
	server.use(compression({
		threshold: 512
	}));

	// Static files middleware
	server.use(express.static(config.root + '/public'));

	// Use winston on production
	var log;
	if (env !== 'development') {
		log = {
			stream: {
				write: function (message, encoding) {
					winston.info(message);
				}
			}
		};
	} else {
		log = 'dev';
	}

	// Don't log during tests
	// Logging middleware
	if (env !== 'test')
		server.use(morgan('combined', log));

	// Swig templating engine settings
	/*if (env === 'development' || env === 'test') {
		swig.setDefaults({
			cache: false
		});
	}*/

	// set views path, template engine and default layout
	/*server.engine('html', swig.renderFile);
	server.set('views', config.root + '/app/views');
	server.set('view engine', 'html');*/

	// expose package.json to views
	server.use(function (req, res, next) {
		res.locals.pkg = pkg;
		res.locals.env = env;
		next();
	});

	// bodyParser should be above methodOverride
	server.use(bodyParser.urlencoded({
		extended: true
	}));
	server.use(bodyParser.json());
	server.use(methodOverride(function (req, res) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
	// look in urlencoded POST bodies and delete it
	var method = req.body._method;
	delete req.body._method;
	return method;
	}
	}));

	// cookieParser should be above session
	server.use(cookieParser());
	server.use(cookieSession({ secret: 'secret' }));
	server.use(session({
		secret: config.session.secret,
		proxy: true,
		resave: true,
		saveUninitialized: true,
		store: new mongoStore({
			url: config.db,
			collection : 'sessions'
		})
	}));

	// use passport session
	// server.use(passport.initialize());
	// server.use(passport.session());

	// connect flash for flash messages - should be declared after sessions
	// server.use(flash());

	// should be declared after session and flash
	// server.use(helpers(pkg.name));

	// adds CSRF support
	if (process.env.NODE_ENV !== 'test') {
		server.use(csrf());

		// This could be moved to view-helpers :-)
		server.use(function(req, res, next){
			res.locals.csrf_token = req.csrfToken();
			next();
		});
	}

	next();
}

module.exports = init;