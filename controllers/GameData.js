var data = exports.data = {
	players: {

	},

	// Queue to notify players
	needsNotify: {},
};

exports.getPlayers = function (){
	var players = [];
	for(var k in data.players)
		players.push(data.players[k]);
	return players;
}

exports.createPlayer = function () {
	var player = {
		code: generateUniqueCode(),
		points: 0,
		cons: {
			l: null,
			t: null,
			r: null,
			b: null,
		}
	};

	data.players[player.code] = player;
	return player;
}

exports.destroyPlayer = function (code){
	// Find Player
	var player = data.players[code];

	if(!player)
		return;

	// Unlink connections
	for(var con in player.cons){
		exports.unlinkPlayer(player, con);
	}

	delete data.players[code];
}

exports.linkPlayer = function (player, otherPlayerId, con){
	var otherPlayer = data.players[otherPlayerId];
	if(!otherPlayer)
		return console.log('No otherPlayer found');

	if(player.code == otherPlayer.code)
		return console.log('Players are equal');

	// Check if user is linked in another con
	for(var k in player.cons){
		if(player.cons[k] && player.cons[k].code == otherPlayer.code){
			exports.unlinkPlayer(player, k);
		}
	}

	// Make sure we don't override players
	exports.unlinkPlayer(player, con);
	exports.unlinkPlayer(otherPlayer, conInverse(con));

	player.cons[con] = otherPlayer;
	otherPlayer.cons[conInverse(con)] = player;

	otherPlayer.notify();
	player.notify();

	return otherPlayer;
}

exports.unlinkPlayer = function (player, con){
	if(!player) return console.log('No player');

	var otherPlayer = player.cons[con];
	if(!otherPlayer) return console.log('No other player: '+player.code+' at '+con);

	var invCon = conInverse(con);

	player.cons[con] = null;
	otherPlayer.cons[invCon] = null;

	otherPlayer.notify();
	player.notify();

	return otherPlayer;
}

/*
	Helpers
*/
function generateUniqueCode(){
	var start = 100;
	var id;
	do{
		id = start.toString(24);
		start++;

		if(start >= 24 * 24){
			console.error('!!! Limit Reached!');
			return '00';
		}

	}while(data.players[id]);

	return id;
}

function conInverse(con){
	return {
		'l': 'r',
		'r': 'l',
		't': 'b',
		'b': 't',
	}[con];
}