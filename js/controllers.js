var streamViewer = angular.module('StreamViewer', ['streamViewer.services'])
    .config(['$compileProvider', function( $compileProvider ) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
]);

streamViewer.controller('StreamListCtrl', ['$scope', 'twitch', function($scope, twitch) {
    $scope.logos = {};
    $scope.logos['World of Warcraft: Mists of Pandaria'] = "img/icon/wow-icon.png";
    $scope.logos['League of Legends'] = "img/icon/league.png";
    $scope.games = ['League of Legends', 'World of Warcraft: Mists of Pandaria'];
    $scope.streams = twitch.getStreams($scope.games);

    $scope.getLogo = function(game) {
        return $scope.logos[game];
    }
}]);