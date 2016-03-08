var express = require('express');

function config(app, next){
	var server = app.server;

	/*
	 * Configure Passport authentication
	 */
	var api = app.api = express();
	
	/*
	 * Api route (Admin only)
	 * Root route: /api/...
	 */
	server.use('/api/', api);

	// Protect /api routes with Authentication
	// api.all('/*', app.helpers.Security.requireAuthentication());
	// api.all('/*', app.helpers.Security.requireRole(['manage', 'admin']));

	api.get('/me', app.controllers.Api.me);

	/*
	 * REST Api for Tags
	 */
	api.get('/tags/create', app.controllers.Tags.create);
	api.get('/tags/:id/update', app.controllers.Tags.update);
	api.get('/tags/:id/delete', app.controllers.Tags.delete);

	api.get('/tags', app.controllers.Tags.find);
	api.get('/tags/:id', app.controllers.Tags.get);


	/*
	 * REST Api for Events
	 */
	api.get('/events/create', app.controllers.Events.create);
	api.get('/events/:id/update', app.controllers.Events.update);
	api.get('/events/:id/delete', app.controllers.Events.delete);

	api.get('/events', app.controllers.Events.find);
	api.get('/events/:id', app.controllers.Events.get);


	/*
	 * REST Api for Users
	 */
	api.get('/users/erase', app.controllers.Users.erase);

	api.get('/users/create', app.controllers.Users.create);
	api.get('/users/:id/update', app.controllers.Users.update);
	api.get('/users/:id/delete', app.controllers.Users.delete);

	api.get('/users', app.controllers.Users.find);
	api.get('/users/:id', app.controllers.Users.get);


	/*
	 * REST Api for Participations
	 */
	api.get('/participations/create', app.controllers.Participations.create);
	api.get('/participations/:id/update', app.controllers.Participations.update);
	api.get('/participations/:id/delete', app.controllers.Participations.delete);

	api.get('/participations', app.controllers.Participations.find);
	api.get('/participations/:id', app.controllers.Participations.get);


	/*
	 * REST Api for Photos
	 */
	api.get('/photos/create', app.controllers.Photos.create);
	api.get('/photos/:id/update', app.controllers.Photos.update);
	api.get('/photos/:id/delete', app.controllers.Photos.delete);

	api.get('/photos', app.controllers.Photos.find);
	api.get('/photos/:id', app.controllers.Photos.get);

	next();
}

module.exports = config;