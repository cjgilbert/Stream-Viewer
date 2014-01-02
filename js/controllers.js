var streamViewer = angular.module('StreamViewer', ['streamViewer.services']);

streamViewer.controller('StreamList', function($scope) {
    $scope.streams = [
        {'name': 'test1'},
        {'name': 'test2'}
    ];
});