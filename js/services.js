angular.module('streamViewer.services', [], function($provide) {
    $provide.factory('twitch', ['$http', function($http){
        return {
            getStreams: function(games, callback) {
                var streams = [];
                for (var i = 0; i < games.length; i++) {
                    $http.get('https://api.twitch.tv/kraken/streams?game='+games[i])
                        .success(function(response) {
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

    $provide.factory('storage', function() {
        return {
            save: function(key, value) {
                var obj = {};
                obj[key] = value;
                chrome.storage.sync.clear();
                chrome.storage.sync.set(obj);
            },
            load: function(key, callback) {
                chrome.storage.sync.get(key, function(result){
                    console.log(result);
                    callback(result);
                });
            }
        }
    });
});