var express = require('express');

function config(app, next){
	var server = app.server;

	/*
	 * Configure Passport authentication
	 */
	var auth = app.auth = express();
	
	/*
	 * Auth route (Logs in with Facebook/Local in Passport)
	 * Root route: /auth/...
	 */
	server.use('/auth/', auth);

	var Auth = app.controllers.Auth;

	auth.get('/logout', 	Auth.logout);
	
	auth.get('/local', 		Auth.local);

	auth.get('/facebook', 	Auth.facebook);
	auth.get('/facebook-callback', 	Auth.facebookCallback);

	auth.get('/me', 		Auth.me);

	next();
}

module.exports = config;