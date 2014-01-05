var streamViewer = angular.module('StreamViewer', ['streamViewer.services']);

streamViewer.controller('StreamListCtrl', ['$scope', 'twitch', function($scope, twitch) {
    $scope.games = ['League of Legends', 'World of Warcraft: Mists of Pandaria'];
    $scope.streams = twitch.getStreams($scope.games);
}]);