var TAG = 'config.mongoose';
var mongoose = require('mongoose');

function config(app, next){
	var options = {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		}
	};

	var attempts = 50;
	function connect(){
		if(--attempts <= 0){
			app.error(TAG, 'Failed to connect multiple times');
			return;
		}
		mongoose.connect(app.config.db, options);
	}
	
	mongoose.connection.on('error', console.error);
	mongoose.connection.on('disconnected', connect);
	mongoose.connection.once('open', function () {
		next();
	});
	
	connect();
}

module.exports = config;