var streamViewer = angular.module('StreamViewer', ['streamViewer.services'])
    .config(['$compileProvider', function( $compileProvider ) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
]);

streamViewer.controller('StreamListCtrl', ['$scope', 'twitch', 'storage', function($scope, twitch, storage) {
    $scope.getLogo = function(game) {
        return $scope.logos[game];
    };

    $scope.loadFavorites = function() {
        storage.load('favorites', function(result) {
            $scope.favorites = result.favorites;
            for (var i = 0; i < $scope.streams.length; i++) {
                if (1 === $scope.favorites[$scope.streams[i].name]) {
                    $scope.$apply(function() {
                        $scope.streams[i].favorite = 1;
                    });
                }
            }
        });
    };

    $scope.toggleFavorite = function(stream) {
        stream.favorite = (stream.favorite === 0) ? 1 : 0;
        if (stream.favorite === 1) {
            $scope.favorites[stream.name] = 1;
        } else {
            if ($scope.favorites[stream.name] = 1) {
                delete $scope.favorites[stream.name];
            }
        }
        storage.save('favorites', $scope.favorites);
    }

    $scope.logos = {};
    $scope.favorites = [];
    $scope.logos['World of Warcraft: Mists of Pandaria'] = "img/icon/wow-icon.png";
    $scope.logos['League of Legends'] = "img/icon/league.png";
    $scope.games = ['League of Legends', 'World of Warcraft: Mists of Pandaria'];
    twitch.getStreams($scope.games, function(response) {
        $scope.streams = response;
        $scope.loadFavorites();
    });

}]);