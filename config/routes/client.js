var express = require('express');

/*
 * How Routes are organized:
	/client
		
		/tags
			/find [name]

		(Requires Authentication and Facebook link)
		/me
			/collect-tag [id]
			/uncollect-tag [id]
*/

function config(app, next){
	var server = app.server;

	/*
	 * Configure Passport authentication
	 */
	var client = app.client = express();
	
	/*
	 * Client route (Open, but requires Facebook authentication in some cases)
	 * Root route: /client/...
	 */
	server.use('/client/', client);

	var Client = app.controllers.Client;

	client.get('/tags/find', 				Client.findTag);

	// Protect /me routes with Authentication
	client.all('/me/*', 					app.helpers.Security.requireAuthentication());

	client.get('/me', 						Client.me);
	client.get('/me/collect-tag', 			Client.collectTag);
	client.get('/me/uncollect-tag',			Client.uncollectTag);

	next();
}

module.exports = config;