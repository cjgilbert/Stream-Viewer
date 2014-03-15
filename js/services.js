angular.module('streamViewer.services', [], function($provide) {
    $provide.factory('twitch', ['$http', function($http){
        return {
            getStreams: function(games, limit, offset, callback) {
                var streams = [];
                for (var i = 0; i < games.length; i++) {
                    var gameLimit = limit/games.length;
                    $http.get('https://api.twitch.tv/kraken/streams?game='+games[i]+'&limit='+gameLimit+'&offset='+offset)
                        .success(function(response) {
                            console.log(response);
                            for (var j = 0; j < response.streams.length; j++) {
                                streams.push({'name': response.streams[j].channel.display_name,
                                    'viewers': response.streams[j].viewers,
                                    'game': response.streams[j].game,
                                    'favorite': 0}
                                );
                            }
                            callback(streams);
                        });
                }
            }
        }
    }]);

    $provide.factory('storage', function() {
        return {
            save: function(key, value) {
                var obj = {};
                obj[key] = value;
                chrome.storage.sync.set(obj);
            },
            load: function(key, callback) {
                chrome.storage.sync.get(key, function(result){
                    callback(result);
                });
            }
        }
    });
});