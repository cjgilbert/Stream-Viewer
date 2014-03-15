streamViewer.directive('scrollTrigger', function($window) {
    return {
        link : function(scope, element, attrs) {
            var offset = parseInt(attrs.threshold) || 0;
            var e = jQuery(element[0]);
            var doc = jQuery(document);
            console.log(doc);
            angular.element(document).bind('scroll', function() {
                console.log(doc.scrollTop() + $window.innerHeight + offset > e.offset().top);
                if (doc.scrollTop() + $window.innerHeight + offset > e.offset().top) {
                    scope.$apply(attrs.scrollTrigger);
                }
            });
        }
    };
});