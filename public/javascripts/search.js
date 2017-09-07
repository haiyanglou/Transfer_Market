var app = angular.module('SearchApp', ['ngResource', 'ngRoute']);

app.config(function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
	.when('/', {
		templateUrl: 'partials/showSearchResult.html',
		controller: 'search'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.filter('offset', function() {
  return function(input, start) {
        if (!input || !input.length) { return; }
    start = parseInt(start, 10);
    return input.slice(start);
  };
});

//the url doesn't change, it's strange.
app.controller('search', ['$scope', '$resource', '$location', '$routeParams',
	function($scope, $resource, $location, $routeParams){
		angular.element(document).ready(function () {
			$scope.clear = function() {
				$scope.nationality = null;
				$scope.position = null;
				$scope.foot = null;
				$scope.newSearchName = "";
			}
			$scope.searchFilter = function() {
				var newSearchName="";
				var nationality="";
				var position="";
				var foot="";
				if($scope.newSearchName !=null) newSearchName=$scope.newSearchName;
				if($scope.nationality !=null) nationality=$scope.nationality;
				if($scope.position !=null) position=$scope.position;
				if($scope.foot !=null) foot=$scope.foot;
				var url = '/api/player?name=' +newSearchName+ '&nationality=' + nationality + "&position=" + position +"&foot=" +foot;
				var Players = $resource(url);
				Players.query(function(players){
				$scope.players = players;
				$scope.makePage();
			});
			}
		})
		var url = $location.$$absUrl.replace('search',"api/player");
		var Players = $resource(url);
		Players.query(function(players){
            $scope.players = players;
		});
		$scope.makePage = function() {
			$scope.playersPerPage = 4;
			$scope.currentPage = 0;
			$scope.range = function() {
				var rangeSize = 5 > $scope.pageCount() ? $scope.pageCount()+1 : 5;
				var ret = [];
				var start;
				start = $scope.currentPage;
				if ( start > $scope.pageCount()-rangeSize ) {
				start = $scope.pageCount()-rangeSize+1;
				}
				for (var i=start; i<start+rangeSize; i++) {
				ret.push(i);
				}
				return ret;
			};
			$scope.prevPage = function() {
				if ($scope.currentPage > 0) {
				$scope.currentPage--;
				}
			};
			$scope.prevPageDisabled = function() {
				return $scope.currentPage === 0 ? "disabled" : "";
			};
			$scope.pageCount = function() {
				if (!$scope.players) { return; }
				return Math.ceil($scope.players.length/$scope.playersPerPage)-1;
			};
			$scope.nextPage = function() {
				if ($scope.currentPage < $scope.pageCount()) {
				$scope.currentPage++;
				}
			};
			$scope.nextPageDisabled = function() {
				return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
			};
			$scope.setPage = function(n) {
				$scope.currentPage = n;
			};
		}
		$scope.makePage();
    }]);