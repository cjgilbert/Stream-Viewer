var streamViewer = angular.module('StreamViewer', ['streamViewer.services'])
    .config(['$compileProvider', function( $compileProvider ) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
]);

streamViewer.controller('StreamListCtrl', ['$scope', 'twitch', 'storage', '$timeout', function($scope, twitch, storage, $timeout) {
    $scope.getLogo = function(game) {
        return $scope.logos[game];
    };

    $scope.saveGames = function() {
        storage.save('games', $scope.games);
        $scope.loadStreams();
        $scope.settings = false;
    };

    $scope.loadGames = function() {
        storage.load('games', function(result) {
            $scope.games = (result.games) ? result.games : [];
            for (var i = 0; i < $scope.games.length; i++) {
                if (-1 == $scope.availableGames.indexOf($scope.games[i])) {
                    delete $scope.games[i];
                }
            }
            $scope.loadStreams();
        });
    };

    $scope.toggleGame = function(val) {
        var index = $scope.games.indexOf(val);
        if (-1 == index) {
            $scope.games.push(val);
        } else {
            $scope.games.splice(index, 1);
        }
    };

    $scope.raiseLimit = function(val) {
        $scope.limit += val;
        $scope.loadStreams();
    };

    $scope.loadStreams = function() {
        if (0 < $scope.games.length) {
            twitch.getStreams($scope.games, $scope.limit, function(response) {
                $scope.streams = response;
                $scope.loadFavorites();
            });
        } else {
            $scope.streams = [];
            $scope.$apply(function() {
                $scope.settings = true;
            });
        }
    };

    $scope.loadFavorites = function() {
        storage.load('favorites', function(result) {
            $scope.favorites = result.favorites;
            if ($scope.favorites) {
                for (var i = 0; i < $scope.streams.length; i++) {
                    if (1 === $scope.favorites[$scope.streams[i].name]) {
                        $scope.$apply(function() {
                            $scope.streams[i].favorite = 1;
                        });
                    }
                }
            }
        });
    };

    $scope.toggleFavorite = function(stream) {
        stream.favorite = (stream.favorite === 0) ? 1 : 0;
        if (stream.favorite === 1) {
            if (!$scope.favorites) {
                $scope.favorites = {};
            }
            $scope.favorites[stream.name] = 1;
        } else {
            if ($scope.favorites[stream.name] = 1) {
                delete $scope.favorites[stream.name];
            }
        }
        storage.save('favorites', $scope.favorites);
    };

    $scope.toggleSettings = function () {
        // Unfortunate hack to allow Chrome extension to update the DOM.
        $scope.width = 399;
        $timeout(function() {
            $scope.width = 400;
        }, 5);
        $scope.settings = !$scope.settings;
    };

    $scope.logos = {};
    $scope.games = {};
    $scope.availableGames = [
        'Call of Duty: Ghosts',
        'Dark Souls II',
        'Diablo III',
        'Hearthstone: Heroes of Warcraft',
        'League of Legends',
        'StarCraft II: Heart of the Swarm',
        'The Elder Scrolls Online',
        'Titanfall',
        'World of Warcraft: Mists of Pandaria'
    ];
    $scope.favorites = {};
    $scope.settings = false;
    $scope.width = 400;
    $scope.limit = 50;
    $scope.logos['Call of Duty: Ghosts'] = 'img/icon/cod-icon.png';
    $scope.logos['Diablo III'] = 'img/icon/diablo-icon.png';
    $scope.logos['Hearthstone: Heroes of Warcraft'] = 'img/icon/hearthstone-icon.png';
    $scope.logos['League of Legends'] = 'img/icon/league-icon.png';
    $scope.logos['StarCraft II: Heart of the Swarm'] = 'img/icon/hots-icon.png';
    $scope.logos['The Elder Scrolls Online'] = 'img/icon/elderscrolls-icon.png';
    $scope.logos['World of Warcraft: Mists of Pandaria'] = '/img/icon/wow-icon.png';
    $scope.logos['Titanfall'] = '/img/icon/titanfall-icon.png';
    $scope.logos['Dark Souls II'] = '/img/icon/ds2-icon.png';
    $scope.games = [];
    $scope.loadGames();
}]);