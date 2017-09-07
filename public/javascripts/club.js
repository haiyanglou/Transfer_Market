var app = angular.module('ClubApp', ['ngResource', 'ngRoute']);

app.config(function($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider
	.when('/', {
	})
	.when('/:id', {
        templateUrl: 'partials/showClubInfo.html',
        controller: 'SearchById'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.controller('SearchById', ['$scope', '$resource', '$location', '$routeParams',
	function($scope, $resource, $location, $routeParams){
		var Clubs = $resource('/api/club/:id');
        Clubs.get({ id: $routeParams.id }, function(club){
			$scope.club = club;
			var Players = $resource('/api/player');
				Players.query({clubId : $scope.club._id},function(players){
					$scope.playersName = players;
				})
		})
    }]);