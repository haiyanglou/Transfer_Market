var app = angular.module('myTeamApp', ['ngResource', 'ngRoute','ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.config(function($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider
	.when('/', {
        templateUrl: 'partials/showMyTeam.html',
		controller: 'TeamInfo'
	})
	// .when('/add-player', {
	// 	templateUrl: 'partials/player-form.html',
	// 	controller: 'AddPlayerCtrl'
	// })
	.when('/player/:id', {
        templateUrl: 'partials/player-form.html',
        controller: 'EditPlayerCtrl'
    })
    .when('/player/delete/:id', {
        templateUrl: 'partials/player-delete.html',
        controller: 'DeletePlayerCtrl'
	})
    .when('/message', {
        templateUrl: 'partials/team_message.html',
        controller: 'ShowTeamMessage'
	})
    .when('/favor', {
        templateUrl: 'partials/team_favor.html',
        controller: 'Showfavor'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.controller('TeamInfo', ['$scope', '$resource', '$location', '$routeParams','$http',
	function($scope, $resource, $location, $routeParams,$http){
		angular.element(document).ready(function () {
            var Clubs = $resource('/api/club');
			Clubs.query(function(clubs){
				$scope.club = clubs[0];
				var Players = $resource('/api/player');
				Players.query({clubId : $scope.club._id},function(players){
					$scope.playersName = players;
				})
			});
			$scope.showTransferHistory = function() {
				var Transfers = $resource('/api/transfer');
				Transfers.query({clubId : $scope.club._id},function(transfers){
					$scope.transferHistories = transfers;
				})
            }
            $scope.showShelf = function() {
				var Players = $resource('/api/player');
				Players.query({clubId : $scope.club._id, shelf : true},function(players){
					$scope.onShelfPlayers = players;
				})
            }
            $scope.save = function() {
				var Players = $resource('/api/player');
				$scope.addPlayer.clubId = $scope.club._id;
				$scope.addPlayer.club = $scope.club.name;
				$scope.addPlayer.shelf = false;
                $scope.addPlayer.delete = false;
                
                var formData = new FormData;
                var file = $('#file')[0].files[0]; 
                if(file !== undefined) {
                    formData.append('image',file);
                    $http.post('http://localhost:3000/myteam/playerimage/upload',formData, {
                        transformRequest: angular.identity,
                        headers:{
                            'Content-Type':undefined
                        }
                    }).then(function(){
                    });
                    $scope.addPlayer.image = file.name;
                } else {
                    $scope.addPlayer.image = "default_tn.jpg";
                }

				Players.save($scope.addPlayer, function(){
					$location.path('/myteam');
				});
			}
		})
    }]);

// app.controller('AddPlayerCtrl', ['$scope', '$resource', '$location',
//     function($scope, $resource, $location){
//         $scope.save = function(){
//             var Players = $resource('/api/player');
//             Players.save($scope.player, function(){
//                 $location.path('/myteam');
//             });
//         };
// 	}]);
	
app.controller('EditPlayerCtrl', ['$scope', '$resource', '$location', '$routeParams','$http',
    function($scope, $resource, $location, $routeParams,$http){
        var Players = $resource('/api/player/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });
        Players.get({ id: $routeParams.id }, function(player){
            $scope.player = player;
        });
        $scope.save = function(){
            var editPlayer = {byManager:true};

            var formData = new FormData;
            var file = $('#file')[0].files[0]; 
            if(file !== undefined) {
                formData.append('image',file);
                $http.post('http://localhost:3000/myteam/playerimage/upload',formData, {
                    transformRequest: angular.identity,
                    headers:{
                        'Content-Type':undefined
                    }
                }).then(function(){
                });
                editPlayer.image = file.name;
            }

			editPlayer.shelf = $scope.player.shelf =="true" ? true : false;
            editPlayer.name = $scope.player.name;
            editPlayer._id = $scope.player._id;
            editPlayer.age = $scope.player.age;
            editPlayer.height = $scope.player.height;
            editPlayer.market_value = $scope.player.market_value;
            
            Players.update(editPlayer, function(){
                $location.path('/myteam');
            });
        }
    }]);

app.controller('DeletePlayerCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Players = $resource('/api/player/:id');
        Players.get({ id: $routeParams.id }, function(player){
            $scope.player = player;
        })
        $scope.delete = function(){
            Players.delete({ id: $routeParams.id }, function(player){
                $location.path('/myteam');
            });
        }
    }]);

app.controller('ShowTeamMessage', ['$scope','$route', '$resource', '$location', '$routeParams',
    function($scope, $route, $resource, $location, $routeParams){
        var thisClub;
        var Clubs = $resource('/api/club');
        Clubs.query(function(clubs){
            thisClub = clubs[0];
            var Messages = $resource('/api/message');
            Messages.query({clubId:thisClub._id}, function(messages){
                $scope.messages = messages;
            })
        });
        $scope.read = function(message){
            var readBy = message.fromClub == thisClub.name ? "readByFrom" : "readByTo";
            var Messages = $resource('/api/message/:id', { id: message._id }, {
                update: { method: 'PUT', params:{readBy:readBy}}
            });
            Messages.update(message, function(){
                $location.path('/message');
                $route.reload();
            });
        }
    }]);

app.controller('Showfavor', ['$scope','$route', '$resource', '$location', '$routeParams','$window',
    function($scope, $route, $resource, $location, $routeParams,$window){
        var thisClub;
        var Clubs = $resource('/api/club');
        Clubs.query(function(clubs){
            thisClub = clubs[0];
            var favor=[];
            for (var i=0; i< thisClub.favor.length;i++){
                var Players = $resource('/api/player/:id');
                Players.get({ id: thisClub.favor[i] }, function(player){
                    favor.push(player);
                })
            }
            $scope.favorPlayers = favor;
        });

        $scope.remove = function(player) {
            var Club = $resource('/api/club/:id', { id: '@_id' }, {
                update: { method: 'PUT' }
            });
            var index = thisClub.favor.indexOf(player._id);
            thisClub.favor.splice(index,1);
            Club.update(thisClub, function(){
                $route.reload();
            });
        }

        $scope.buy = function(player) {
            if(player.club === thisClub.name) alert('This player is already in your team.');
            else {
                var transferRequests;
                var Transfers = $resource('/api/transfer');
                Transfers.query({readByAdmin : false},function(transfers){
                    transferRequests = transfers;
                    
                    var i;
                    for(i =0; i < transferRequests.length; i++) {
                        if(transferRequests[i].playerName == player.name && 
                            transferRequests[i].fromClub==player.club && 
                            transferRequests[i].toClub == thisClub.name) {
                                addAlert('danger','Duplicate Request.');
                                break;
                            }
                    }

                    if(i == transferRequests.length) {
                        var transferRequest = {};
                        transferRequest.fromId = player.clubId;
                        transferRequest.fromClub = player.club;
                        transferRequest.toId = thisClub._id;
                        transferRequest.toClub = thisClub.name;
                        transferRequest.playerId = player._id;
                        transferRequest.playerName = player.name;
                        transferRequest.date = new Date();
                        transferRequest.transfer_fee = player.market_value;
                        transferRequest.readByAdmin = false;

                        Transfers.save(transferRequest, function(){
                            addAlert('success',"You send a transfer request to admin");
                        });
                    }
                });
            }
        }

        $scope.alerts = [];

		addAlert = function(type, content) {
			$scope.alerts.push({type:type,msg: content});
		};

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
    }]);

