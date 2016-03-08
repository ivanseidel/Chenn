var io;
var GameData;

exports.initializeSocket = function () {
	io = app.io;
	GameData = app.controllers.GameData;

	// Game Players Socket
	io.of('/admin').on('connection', exports.onConnect);

	setInterval(exports.updateAll, 100);
	exports.updateAll();
}

var Admins = {};
exports.onConnect = function (socket){
	Admins[socket.id] = socket;
	console.log('New admin: ', socket.id);

	socket.on('disconnect', _.bind(exports.onDisconnect, socket));
}


exports.onDisconnect = function(){
	console.log('Admin left: ', this.id);
	
	delete Admins[this.id];
}

var a = 0;
exports.updateAll = function (){

	var players = GameData.getPlayers();

	var inverseId = {};
	// Build Graph
	var Graph = {
		links: [
{
	id: "51-44",
	source: 7,
	target: 0,
},
{
	id: "51-47",
	source: 7,
	target: 3,
},
{
	id: "4a-47",
	source: 13,
	target: 3,
},
{
	id: "4a-44",
	source: 13,
	target: 0,
},
{
	id: "4c-4a",
	source: 14,
	target: 13,
},
{
	id: "4j-52",
	source: 16,
	target: 8,
},
{
	id: "4g-4j",
	source: 17,
	target: 16,
},
{
	id: "4b-53",
	source: 18,
	target: 9,
},
{
	id: "4m-51",
	source: 20,
	target: 7,
},
{
	id: "4m-4b",
	source: 20,
	target: 18,
}],
	
nodes: [
{
	group: 0,
	id: "44",
	name: "Jonas",
	value: 366,
},
{
	group: 1,
	id: "45",
	name: "Matheus",
	value: 0,
},
{
	group: 2,
	id: "46",
	name: "Glaucia",
	value: 420,
},
{
	group: 3,
	id: "47",
	name: "Lígia",
	value: 510,
},
{
	group: 4,
	id: "48",
	name: "Christian",
	value: 0,
},
{
	group: 5,
	id: "49",
	name: "Pelé",
	value: 0,
},
{
	group: 6,
	id: "50",
	name: "Marina Linda ❤️",
	value: 0,
},
{
	group: 7,
	id: "51",
	name: "LUÃ",
	value: 525,
},
{
	group: 8,
	id: "52",
	name: "Matheus Frizo",
	value: 354,
},
{
	group: 9,
	id: "53",
	name: "Sparvoli",
	value: 303,
},
{
	group: 10,
	id: "54",
	name: "Tieme",
	value: 0,
},
{
	group: 11,
	id: "55",
	name: "Leonardo Denis",
	value: 0,
},
{
	group: 12,
	id: "57",
	name: "Yago",
	value: 357,
},
{
	group: 13,
	id: "4a",
	name: "Nathalia R.",
	value: 315,
},
{
	group: 14,
	id: "4c",
	name: "Kaio",
	value: 414,
},
{
	group: 15,
	id: "4f",
	name: "Ale Foppa",
	value: 432,
},
{
	group: 16,
	id: "4j",
	name: "Jvp",
	value: 408,
},
{
	group: 17,
	id: "4g",
	name: "Heitor",
	value: 405,
},
{
	group: 18,
	id: "4b",
	name: "Lucas moreira",
	value: 423,
},
{
	group: 19,
	id: "4e",
	name: "Marina é maravilhosa 💘",
	value: 390,
},
{
	group: 20,
	id: "4m",
	name: "Hydra",
	value: 399,
},
{
	group: 21,
	id: "4i",
	name: "Iva",
	value: 0,
},
{
	group: 22,
	id: "5b",
	name: "Rosiane",
	value: 0,
},
{
	group: 23,
	id: "4l",
	name: "Raul",
	value: 33,
},
{
	group: 24,
	id: "4d",
	name: "Rodrigo Cabral",
	value: 0,
}]
		// nodes: 
		// [
		// 	// {id: '44', value: 100,},
		// 	// {id: '45', value: 20,},
		// 	// {id: '46', value: 0,},
		// ],
		// links: [
		// 	// {id: '44-45', source: 0, target: 1},
		// 	// {id: '44-46', source: 0, target: 2},	
		// ],
	};

	// if(++a % 2 == 0){
	// 	Graph.nodes.push({id: '47', value: 14,});
	// 	Graph.links.push({id: '44-47', source: 0, target: 3});
	// 	Graph.links.push({id: '46-47', source: 2, target: 3});
	// }

	// for(var k = 0; k < players.length; k++){
	// 	var player = players[k];

	// 	Graph.nodes.push({
	// 		id: player.code,
	// 		value: player.points,
	// 		name: player.name,
	// 		group: k,
	// 	});
	// 	inverseId[player.code] = k;

	// 	var cons = player.cons;
	// 	for(var j in cons){
	// 		// console.log(player.code+': '+j+' '+(cons[j] ? inverseId[cons[j].code]:'-'));
	// 		if(cons[j] && !_.isUndefined(inverseId[cons[j].code])){

	// 			Graph.links.push({
	// 				id: player.code+'-'+cons[j].code,
	// 				source: k,
	// 				target: inverseId[cons[j].code],
	// 				// value: 60,
	// 			});
	// 		}

	// 	}
	// }
	// console.log(inverseId);

	io.of('/admin').emit('refresh', Graph);
}