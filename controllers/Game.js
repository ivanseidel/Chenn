var io;
var GameData;

exports.initializeSocket = function (){

	io = app.io;
	GameData = app.controllers.GameData;

	// Game Players Socket
	io.of('/room').on('connection', exports.onPlayerConnected);

	setInterval(exports.updateAll, 1000);

	// Initialize Admin
	app.controllers.Admin.initializeSocket();
}

exports.onPlayerConnected = function  (socket) {

	var player = GameData.createPlayer();
	player.socket = socket;
	player.notify = _.bind(exports.notifyPlayer, player);
	
	console.log('New connection: ', socket.id, player.code);

	socket.on('disconnect', _.bind(exports.onPlayerDisconnected, player));

	socket.on('save', _.bind(exports.onPlayerUpdateData, player));
	socket.on('link', _.bind(exports.onPlayerLink, player));
	socket.on('score', _.bind(exports.onPlayerScore, player));

	socket.on('state', _.bind(exports.setGameState, player));

	socket.on('beat', function (){
		io.of('/admin').emit('beat', player.code);
	});

	player.notify();
}

exports.onPlayerUpdateData = function (data, next){
	console.log('onPlayerUpdateData',  this.code);

	if(!data) return;

	for(var k in data){
		this[k] = data[k];
	}

	this.notify();
}

exports.onPlayerDisconnected = function (){
	console.log('onPlayerDisconnected', this.code);
	GameData.destroyPlayer(this.code);
}

exports.onPlayerLink = function (data, next){
	console.log('onPlayerLink',  this.code, data);
	var linked = GameData.linkPlayer(this, data[0], data[1]);
	next && next(!!linked);
}

exports.onPlayerScore = function (data){
	console.log('onPlayerScore',  this.code, data[0]);

	this.points+= data*1;

	this.notify();
}

exports.notifyPlayer = function (){
	console.log('notifyPlayer',  this.code);

	this.socket.emit('update', wrapPlayer(this));
}

/*
	Used by Controller
*/
var GAME_STATE = 'LINK';
var GAME_MESSAGE = 'Conecte-se';
var GAME_TIME = 60;

exports.setGameState = function (state){

	var players = GameData.getPlayers();

	if(state == 'RESET_CONS'){

		for(var p in players){
			var player = players[p];
			GameData.unlinkPlayer(player, 'l');
			GameData.unlinkPlayer(player, 't');
			GameData.unlinkPlayer(player, 'r');
			GameData.unlinkPlayer(player, 'b');
		}

	}if(state == 'LINK'){
		
		GAME_STATE = 'LINK';
		GAME_MESSAGE = 'Conecte-se';

	}else if(state == 'GAME_WAR'){
		// Reset scores
		for(var p in players){
			var player = players[p];
			player.points = 0;
		}


		GAME_STATE = 'GAME_WAR';
		GAME_MESSAGE = 'Clique na tela! 60s';
		GAME_TIME = 60;
	}else if(state == 'GAME_ENDED'){

		GAME_STATE = 'GAME_ENDED';
		GAME_MESSAGE = 'Fim =)';
	}

	for(var p in players){
		var player = players[p];

		player.socket.emit('update', wrapPlayer(player));
	}
}

exports.updateAll = function (){
	var players = GameData.getPlayers();

	if(GAME_STATE == 'GAME_WAR'){
		if(GAME_TIME > 0)
			GAME_TIME--;

		if(GAME_TIME <= 0){
			GAME_MESSAGE = 'Finalizado...';
			exports.setGameState('GAME_ENDED');
		}else{
			GAME_MESSAGE = 'Clique na tela! '+GAME_TIME+'s';
		}
	}


	for(var p in players){
		var player = players[p];

		player.socket.emit('update', wrapPlayer(player));
	}
}


/*
	Helpers
*/
function wrapPlayer(player, simplify){
	if(!player)
		return null;

	if(simplify){
		return _.pick(player, ['code', 'points', 'name']);
	}

	var outPlayer = _.pick(player, ['code', 'points', 'name']);

	outPlayer.cons = {};
	for(var k in player.cons){
		outPlayer.cons[k] = wrapPlayer(player.cons[k], true);
	}

	outPlayer.state = GAME_STATE;
	outPlayer.message = GAME_MESSAGE;

	return outPlayer;
}