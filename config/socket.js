
function config(app, next){
	
	app.io = require('socket.io')(app.httpServer);

	app.controllers.Game.initializeSocket();

	next();
}

module.exports = config;