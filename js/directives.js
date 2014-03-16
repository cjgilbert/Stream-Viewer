/**
 * Directive to trigger when user scrolls within a certain distance from the bottom of the element
 */
streamViewer.directive('scrollTrigger', function() {
    return {
        link : function(scope, element, attrs) {
            var content = jQuery(attrs.scrollContent);
            angular.element(attrs.scrollContent).bind('scroll', function() {
                if (25 >= content[0].scrollHeight - (content.height() + content.scrollTop())) {
                    scope.$apply(attrs.scrollTrigger);
                }
            });
        }
    };
});
