angular.module('streamViewer.services', [], function($provide) {
    $provide.factory('twitch', ['$http', function($http){
        return {
            getStreams: function(games) {
                var streams = [];
                for (var i = 0; i < games.length; i++) {
                    $http.get('https://api.twitch.tv/kraken/streams?game='+games[i])
                        .success(function(response) {
                            console.log(response);
                            for (var j = 0; j < response.streams.length; j++) {
                                streams.push({'name': response.streams[i].channel.name});
                            }
                        });
                }

                return streams;
            }
        }
    }]);
});