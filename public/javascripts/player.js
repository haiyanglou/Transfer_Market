var app = angular.module('PlayerApp', ['ngResource', 'ngRoute','ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.config(function($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider
	.when('/', {
	})
	.when('/:id', {
        templateUrl: 'partials/showPlayerInfo.html',
        controller: 'SearchById'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.controller('SearchById', ['$scope', '$resource', '$location', '$routeParams','$window',
	function($scope, $resource, $location, $routeParams,$window){
		if($window.hasLogin) {
			var thisClub;
			var Clubs = $resource('/api/club');
			Clubs.query(function(clubs){
				if (clubs.length > 1) {
					$scope.disableButton = true;
				}
				thisClub = clubs[0];
			});
		}
		
		var Players = $resource('/api/player/:id');
        Players.get({ id: $routeParams.id }, function(player){
			$scope.player = player;
			var Transfers = $resource('/api/transfer');
			Transfers.query({playerId : $scope.player._id},function(transfers){
				$scope.transferHistories = transfers;
			})
		})
		$scope.favor = function(player) {
			if(!$window.hasLogin) $window.location.href = '/login';
			else {
				var Club = $resource('/api/club/:id', { id: '@_id' }, {
						update: { method: 'PUT' }
					});
				if (thisClub.favor.indexOf(player._id) !== -1) addAlert('danger','This player is already in your favorite list');
				else if(player.club === thisClub.name) addAlert('danger','This player is already in your team.');
				else {
					thisClub.favor.push(player._id);
					Club.update(thisClub, function(){
						$window.location.href = '/myteam#/favor';
					});
				}
			}
		}
		$scope.buy = function(player) {
			if(!$window.hasLogin) $window.location.href = '/login';
			else {
				if(player.club === thisClub.name) addAlert('danger','This player is already in your team.');
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

							// var Transfers = $resource('/api/transfer');
							Transfers.save(transferRequest, function(){
								addAlert('success',"You send a transfer request to admin");
							});
						}
					})
				}
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