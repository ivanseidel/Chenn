var CLICKS_TO_KILL = 10;

var app = angular.module('Game', [])

.factory('GameState', function(){
	
	return {
		// Name
		name: null,

		data: null,

		cumulativeClick: 0,

		recover: {
			l: null,
			r: null,
			b: null,
			t: null,
		},
		// // LINK, GAME_WAR
		// state: 'LINK',
		// // Message
		// message: 'Chenn',
		// // My code
		// code: null,
		// // Connections
		// connections: {
		// 	l: null,
		// 	t: null,
		// 	r: null,
		// 	b: null,
		// 	m: null,
		// },

		socket: null,
	};
})

.controller('InfoCtrl', ['$scope', 'GameState', '$location', '$rootScope',
	function($scope, GameState, $location, $rootScope){

		$scope.loading = false;

		console.log('InfoCtrl', GameState);

		$scope.initGame = function (){
			var socket = GameState.socket = io.connect('/room');
			$scope.loading = true;

			// Try connection
			socket.on('update', function (data){
				GameState.data = data;
				$rootScope.$apply();
				console.log('update', GameState.data);

				if(GameState.data.state == 'LINK'){
					cumulativeClick = 0;
				}

				if(GameState.data.name == GameState.name){
					for(var k in GameState.data.cons){
						if(GameState.data.cons[k])
							GameState.recover[k] = GameState.data.cons[k].code;
					}
				}else{
					socket.emit('save', {name: GameState.name});
				}

				// if(!GameState.data || !GameState.data.name){
					// $location.path('/');
				// }
			});

			// Create Player and get data
			// socket.emit('save', {name: GameState.name});

			socket.once('connect', function (){
				// All ok, keep goind
				$location.path('/play');
			});

			socket.on('disconnect', function (){
				socket.once('connect', function (){
					console.log('recovering...');
					for(var k in GameState.recover){
						console.log('recovering: ',GameState.recover);
						if(GameState.recover[k]){
							// socket.emit('link', [GameState.recover[k], k]);
						}
					}
				});
			});

			socket.on('error', function (err){
				console.error(err);
			});
		}

	}
])

.controller('GameCtrl', ['$scope', '$rootScope', 'GameState', '$location',
	function($scope, $rootScope, GameState, $location){

		// Check if Chenn is initialized
		if(!GameState.socket || !GameState.data)
			return $location.path('/');

		$scope.clickedBtn = function (btn){
			eventHandlers[GameState.data.state](btn);
		}

		$scope.btnClass = function (btn){
			if(GameState.data.state == 'LINK' || GameState.data.state == 'GAME_ENDED'){
				if(btn == 'm'){
					return 'btn--blue';
				}

				if(GameState.data.cons[btn])
					return 'btn--green';

				return 'btn--grey';
			}

			if(GameState.data.state == 'GAME_WAR'){
				if(btn == 'm'){
					return 'btn--green';
				}

				if(GameState.data.cons[btn])
					return 'btn--green';

				return 'btn--grey';
			}

			return 'btn--yellow';
		}

		$scope.btnText = function (btn){
			// console.log('btnText', btn);
			if(GameState.data.state == 'LINK'){
				if(btn == 'm')
					return 'Código #'+GameState.data.code;
					
				if(GameState.data.cons[btn])
					return '#'+GameState.data.cons[btn].code;

				return '-';
			}

			if(GameState.data.state == 'GAME_WAR'){
				if(btn == 'm')
					return GameState.cumulativeClick + GameState.data.points;

				if(GameState.data.cons[btn])
					return GameState.data.cons[btn].points;

				return '-';
			}

			if(GameState.data.state == 'GAME_ENDED'){
				if(btn == 'm')
					return 'Pontos: '+GameState.data.points;

				if(GameState.data.cons[btn])
					return GameState.data.cons[btn].points;

				return '-';
			}

			return '?2';
		}

		var eventHandlers = {
			LINK:  function (btn){
				var translate = {
					l: 'esquerda',
					t: 'frente',
					r: 'direita',
					b: 'tras'
				}
				if(['l', 'r', 't', 'b'].indexOf(btn) >= 0){
					console.log('Connect to '+btn);
					var id = prompt("Digite o Código da pessoa à "+translate[btn]+' de você:');
					if(id == 'GO'){
						return GameState.socket.emit('state', 'GAME_WAR');
					}
					if(id){
						GameState.socket.emit('link', [id, btn]);
					}
				}

				if(btn == 'm'){
					GameState.socket.emit('beat');
				}
			},

			GAME_WAR: function (btn){
				if(btn == 'm'){
					GameState.cumulativeClick++;

					if(GameState.cumulativeClick > 2 + Math.random() * 0){
						GameState.data.points += GameState.cumulativeClick;
						GameState.socket.emit('score', GameState.cumulativeClick);
						GameState.cumulativeClick = 0;
					}
				}
			},
			GAME_ENDED: function (btn){
			}
		}


	}
]);