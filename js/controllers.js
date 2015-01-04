var streamViewer = angular.module('StreamViewer', ['streamViewer.services'])
    // chrome-extension to be excluded from img sanitization.
    .config(['$compileProvider', function( $compileProvider ) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
]);

streamViewer.controller('StreamListCtrl', ['$scope', 'twitch', 'storage', '$timeout', function($scope, twitch, storage, $timeout) {
    $scope.getLogo = function(game) {
        if ($scope.logos[game]) {
            return $scope.logos[game];
        } else {
            return $scope.logos['Unknown'];
        }
    };

    $scope.saveGames = function() {
        storage.save('games', $scope.games);
        $scope.offset = 0;
        $scope.streams = [];
        $scope.settings = false;
        $scope.loadGames();
    };

    $scope.loadGames = function() {
        storage.load('games', function(result) {
            $scope.games = (result.games) ? result.games : [];
            for (var i = 0; i < $scope.games.length; i++) {
                if (-1 == $scope.availableGames.indexOf($scope.games[i])) {
                    delete $scope.games[i];
                }
            }
            $scope.loadSubGames();
            $scope.loadStreams();
        });
    };

    $scope.loadSubGames = function() {
        for (var i = 0; i < $scope.games.length; i++) {
            if ($scope.subGames[$scope.games[i]]) {
                $scope.games = _.union($scope.games, $scope.subGames[$scope.games[i]]);
            }
        }
    };

    $scope.toggleGame = function(val) {
        var index = $scope.games.indexOf(val);
        if (-1 == index) {
            $scope.games.push(val);
        } else {
            $scope.games.splice(index, 1);
        }
    };

    $scope.raiseOffset = function() {
        $scope.offset++;
        $scope.loadStreams();
    };

    $scope.loadStreams = function() {
        if (0 < $scope.games.length) {
            twitch.getStreams($scope.games, $scope.limit, $scope.offset, function(response) {
                if (!$scope.streams) {
                    $scope.streams = [];
                }
                angular.forEach(response, function(responseVal) {
                    var exists = false;
                    angular.forEach($scope.streams, function(val) {
                        if (val.name === responseVal.name) {
                            exists = true;
                        }
                    });
                    if (!exists) {
                        $scope.streams.push(responseVal);
                    }
                });
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
        'Dota 2',
        'EVE Online',
        'Hearthstone: Heroes of Warcraft',
        'League of Legends',
        'Magic: The Gathering',
        'StarCraft II: Heart of the Swarm',
        'The Elder Scrolls Online',
        'Titanfall',
        'WildStar',
        'World of Warcraft: Warlords of Draenor'
    ];
    $scope.subGames = {
        'Diablo III': ['Diablo III: Reaper of Souls']
    };
    $scope.favorites = {};
    $scope.settings = false;
    $scope.width = 400;
    $scope.limit = 50;
    $scope.offset = 0;
    $scope.logos['Call of Duty: Ghosts'] = 'img/icon/cod-icon.png';
    $scope.logos['Diablo III'] = 'img/icon/diablo-icon.png';
    $scope.logos['Diablo III: Reaper of Souls'] = 'img/icon/diablo-icon.png';
    $scope.logos['Dota 2'] = 'img/icon/dota2-icon.png';
    $scope.logos['EVE Online'] = 'img/icon/eve-icon.png';
    $scope.logos['Hearthstone: Heroes of Warcraft'] = 'img/icon/hearthstone-icon.png';
    $scope.logos['League of Legends'] = 'img/icon/league-icon.png';
    $scope.logos['Magic: The Gathering'] = 'img/icon/mtg-icon.png';
    $scope.logos['StarCraft II: Heart of the Swarm'] = 'img/icon/hots-icon.png';
    $scope.logos['The Elder Scrolls Online'] = 'img/icon/elderscrolls-icon.png';
    $scope.logos['World of Warcraft: Warlords of Draenor'] = '/img/icon/wow-icon.png';
    $scope.logos['Titanfall'] = '/img/icon/titanfall-icon.png';
    $scope.logos['Dark Souls II'] = '/img/icon/ds2-icon.png';
    $scope.logos['WildStar'] = '/img/icon/wildstar-icon.png';
    $scope.logos['Unknown'] = '/img/icon/twitch-icon.png';
    $scope.games = [];
    $scope.loadGames();
}]);