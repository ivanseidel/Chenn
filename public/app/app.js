var app = angular.module('App', [
	'ngMaterial',
	'lumx',
	'ngResource',
	'ngRoute',
	'ngAnimate',
	'ngFx',
	'ngTouch',

	'Game',
])

.factory('QueryData', function(){
    // I know this doesn't work, but what will?
    return {
    	query: ''
    };
})

.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: '/views/ask_info.html',
		controller: 'InfoCtrl',
	})

	.when('/play', {
		templateUrl: '/views/game.html',
		controller: 'GameCtrl',
	})

	.otherwise({
		redirectTo: '/'
	});

	// $location.path('/');
})


.controller('AppCtrl', ['$rootScope', '$location', 'GameState',
	function($rootScope, $location, GameState){

		$rootScope.checked = "ok!";

		$rootScope.gameState = GameState;

		$rootScope.go = function (path){
			$location.path(path);
		}
	}
])