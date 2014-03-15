streamViewer.directive('scrollTrigger', function() {
    return {
        link : function(scope, element, attrs) {
            var content = jQuery(attrs.scrollContent);
            angular.element(attrs.scrollContent).bind('scroll', function() {
                if (10 >= content[0].scrollHeight - (content.height() + content.scrollTop())) {
                    scope.$apply(attrs.scrollTrigger);
                }
            });
        }
    };
});
