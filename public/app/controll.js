var app = angular.module('App', [
	'ngMaterial',
	'lumx',
	'ngResource',
	'ngRoute',
	'ngAnimate',
	'ngFx',
	'ngTouch',
	])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: '/views/controller.html',
		controller: 'AppCtrl',
	})

	.otherwise({
		redirectTo: '/'
	});

	// $location.path('/');
})


.controller('AppCtrl', ['$rootScope', '$location', '$scope',
	function($rootScope, $location, $scope){

		var socket = io('/admin');

		socket.off('refresh');
		socket.on('refresh', function (data){
			refreshGraph(data);
		});

		socket.once('connect', function (){
		});

		socket.on('beat', function (user){
			// svg.select('circle-'+user)
				// .transition()
				// .duration(200)
				// .attr('r', MAX_SIZE);
				// console.log('beat: '+user)
		});

		// Graph
		var width = 1280;
		var height = 720;

		var color = d3.scale.category20();

		var force = d3.layout.force()
			.gravity(0.1)
			.charge(-1000)
			.linkDistance(100)
			.size([width, height]);

		var svg = d3.select("#room-graph").append("svg")
			.attr("width", width)
			.attr("height", height);

		var updates = 0;
		var lastVal = null;

		$scope.topPlayers = [];

		var MAX_SIZE = 40;
		var SCALE = 10;
		function refreshGraph(graph){
			console.info('refresh', graph);
			$scope.$apply();

			// Find max values
			var enableScores = false;
			var max = MAX_SIZE;
			for(var k in graph.nodes){
				var n = graph.nodes[k];
				if(n.value > 0)
					enableScores = true;
				if(n.value > max)
					max = n.value;
			}
			SCALE = MAX_SIZE/max;

			// Find Top players
			var sorted = _.sortBy(graph.nodes, 'value').reverse();
			$scope.topPlayers = [];
			if(enableScores){
				for(var k = 0; k < 3; k++){
					var p = sorted[k];
					if(!p) continue;
					$scope.topPlayers.push((k*1+1)+'º: '+p.name + ' #'+p.id+' - ' + p.value);
				}
			}

			var nodes = svg.selectAll(".node").data(graph.nodes, function (d){ return d.id });

			var nodeEnter = nodes.enter().append("g")
                .attr("class", "node")
                .call(force.drag);

			nodeEnter.append("svg:circle")
				.attr("class", "node-circle")
				.attr("class", function(d) { return 'node-circle circle-'+d.id })
				.attr("r", 10)
				.style("fill", function(d) { return color(d.group); })

			nodeEnter.append("svg:text")
                .attr("class", "textClass")
                .attr("x", 14)
                .attr("y", ".51em")
                    
            nodes.selectAll(".textClass")
            	.text(function (d) {
                    return (d.name || '') + ':#'+d.id;
                });

			nodes.exit()
				.transition().duration(100)
					.attr("r", 0)
					.remove();

			var links = svg.selectAll(".link").data(graph.links, function (d){ return d.id; });

			links.enter()
				.append("line")
				.attr("class", "link")
				.style("stroke-width", function(d) { return Math.sqrt(d.value); });

			links.exit()
				.remove();

			force
				.nodes(nodes.data(), function (d){ return d.id })
				.links(links.data(), function (d){ return d.id })
				.start();


			force.on("tick", function() {
				links.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

				nodes
					.attr("transform", function (d) {
	                    return "translate(" + d.x + "," + d.y + ")";
	                }).select(".node-circle")
                	.attr('r', function(d) {
                		return 10 + d.value * SCALE
                	});
				// nodes.attr("cx", function(d) { 
				// 	if(d.id == '44'){
				// 		if(d != lastVal && lastVal){
				// 			console.error(d);
				// 			// d.x = lastVal.x;
				// 			// d.y = lastVal.y;
				// 			// d.px = lastVal.px;
				// 			// d.py = lastVal.py;
				// 			// d.
				// 		}
				// 		lastVal = d;
				// 		// console.log(d.x);
				// 	}
				// 	return d.x; 
				// })
				// 	.attr("cy", function(d) { return d.y; })
				// 	.;

			});
			updates++;
		};

	}
	])