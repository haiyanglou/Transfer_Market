var app = angular.module('AdminApp', ['ngResource', 'ngRoute']);

app.config(function($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('');
	$routeProvider
	.when('/', {
        templateUrl: 'partials/admin_index.html'
	})
	.when('/transferrequest', {
		templateUrl: 'partials/admin_transferRequest.html',
		controller: 'ShowTransferRequest'
	})
    .when('/transferhistory', {
        templateUrl: 'partials/admin_transferHistory.html',
        controller: 'ShowTransferHistory'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.controller('ShowTransferRequest', ['$scope','$route', '$resource', '$location', '$routeParams',
    function($scope, $route, $resource, $location, $routeParams){
       var Transfers = $resource('/api/transfer');
        Transfers.query({readByAdmin : false},function(transfers){
            $scope.transferRequests = transfers;
        })

        $scope.approve = function(transferRequest) {
            var player = {};
            player.id = transferRequest.playerId;
            player.club = transferRequest.toClub;
            player.clubId= transferRequest.toId;
            player.shelf = false;
            player.delete = false;
            updatePlayer(player);

            transferRequest.approved = true;
            updateTransferHistory(transferRequest);

            generateMessage(transferRequest);
            $route.reload();
        }
        $scope.decline = function(transferRequest) {
            transferRequest.approved = false;
            updateTransferHistory(transferRequest);

            generateMessage(transferRequest);
            $route.reload();
        }
        updatePlayer = function(player) {
            var Players = $resource('/api/player/:id', { id: player.id }, {
                update: { method: 'PUT' }
            });
            Players.update(player, function(){
                // $location.path('/myteam');
            });
        }
        updateTransferHistory = function(transfer) {
            var Transfers = $resource('/api/transfer/:id', { id: '@_id' }, {
                update: { method: 'PUT' }
            });
            transfer.readByAdmin = true;
            Transfers.update(transfer, function(){
                // $location.path('/myteam');
            });
        }
        generateMessage = function (transferRequest) {
            var message = {};
            message.fromId = transferRequest.fromId;
            message.fromClub = transferRequest.fromClub;
            message.toId = transferRequest.toId;
            message.toClub = transferRequest.toClub;
            message.playerId = transferRequest.playerId;
            message.playerName = transferRequest.playerName;
            message.transferId = transferRequest._id;
            message.approved = transferRequest.approved;
            message.transfer_fee = transferRequest.transfer_fee;
            message.readByFrom = false;
            message.readByTo = false;

            var Messages = $resource('/api/message');
            Messages.save(message, function(){
                // $location.path('/myteam');
            });
        }
    }]);
app.controller('ShowTransferHistory', ['$scope','$route', '$resource', '$location', '$routeParams','$window',
    function($scope, $route, $resource, $location, $routeParams,$window){
        var Transfers = $resource('/api/transfer');
				Transfers.query({readByAdmin : true},function(transfers){
					$scope.transferHistories = transfers;
				})
    }]);

