var TAG = 'start.server';

/**
 * Module dependencies
 */

var async = require('async');

/**
 * Global App Object
 */
var app = {
	config: require('./config/config'),
};

/**
 * Define Globals
 */
GLOBAL.app = app;
GLOBAL._ = require('lodash');

/*
 * Bootstrap Process
 */
var configSetps = [
	// Setup Logging
	require('./config/log'),

	// Connect to DB
	// require('./config/mongoose'),

	// Bootstrap Helpers
	require('./config/helpers'),

	// Bootstrap Models
	// require('./config/models'),

	// Bootstrap Controllers
	require('./config/controllers'),

	// Bootstrap Libraries (fbgraph, )
	// require('./config/libraries'),

	// Bootstrap passport config
	// require('./config/passport'),

	// Bootstrap application settings
	require('./config/express'),

	// Start static serving on /public folder
	require('./config/express-assets'),

	// Sockets
	require('./config/socket.js'),

	// Bootstrap Authentication routes
	// require('./config/routes/auth'),

	// Bootstrap API routes
	// require('./config/routes/api'),

	// Bootstrap CLIENT routes
	// require('./config/routes/client'),

	// Bootstrap routes (Error handling)
	require('./config/routes'),

	// Start Server
	require('./config/lift'),
];

/*
	This is the Lift hook, that
	allows Tests to wait for lift.
*/
var onLift = null;
var lifted = false;
module.exports = function setLiftCallback(callback){
	onLift = callback;
	// Maybe, it's already lifted.
	if(lifted) process.nextTick(onLift);
}

// Configure steps and initialize
async.eachSeries(configSetps, function (config, next){
	config(app, next);
}, function (err){
	if(err){
		app.error(TAG, 'Failed to initialize Server: %s', err);
		throw err;
	}else{
		app.info(TAG, 'Server lifted on port', app.config.port, '['+app.config.env+']');
		lifted = true;
		onLift && process.nextTick(onLift);
	}
});
