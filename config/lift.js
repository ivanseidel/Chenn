var TAG = 'config.lift';

function config(app, next){
	
	// Bind server to port
	app.httpServer.listen(app.config.port, '0.0.0.0');

	next();
}

module.exports = config;