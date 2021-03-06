angular.module('streamViewer.services', [], function($provide) {
    /**
     * Twitch service for returning lists of streams.
     */
    $provide.factory('twitch', ['$http', function($http){
        return {
            getStreams: function(games, limit, offset, callback) {
                var gameLimit = Math.floor(limit/games.length);
                offset = offset * gameLimit;
                for (var i = 0; i < games.length; i++) {
                    $http.get('https://api.twitch.tv/kraken/streams?client_id=afcsscnpkjvfi3nwmmkaj9b1lu3312t&game='+games[i]+'&limit='+gameLimit+'&offset='+offset)
                        .success(function(response) {
                            var streams = [];
                            for (var j = 0; j < response.streams.length; j++) {
                                streams.push({'name': response.streams[j].channel.name,
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

    /**
     * Chrome sync storage service for getting/setting settings.
     */
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