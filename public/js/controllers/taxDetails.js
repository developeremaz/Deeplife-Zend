skeletonControllers.controller('TaxDetailsCtrl', ['$scope', '$location', '$window', 'TaxResource', 'Utils',
    function($scope, $location, $window, TaxResource, Utils) {
        $scope.currentTax = null;

        $scope.deleteTax = function() {
            if(confirm(_p("Do you really want to delete '%1'?", [$scope.currentTax.title]))) {
                // Send DELETE command
                $scope.currentTax.$delete(function() {
                    // On success, go back to the list
                    $window.history.back();
                });
            }
        };

        // Watch for modification and send an update to the backend
        $scope.$watch('currentTax', function(newvalue, oldvalue) {
            if(newvalue && oldvalue && newvalue.$resolved && oldvalue.$resolved)
                angular.forEach(newvalue, function(value, field) {
                    if(field.indexOf('$$') === -1 && typeof value !== "object" && value !== oldvalue[field]) {
                        var temp = new TaxResource();
                        temp[field] = value;

                        temp.$update({id: newvalue.id});
                    }
                });
        }, true);

        // Load as soon as possible.
        // We are not using angularjs routing. We need to parse the url ourselves.
        var taxId = Utils.getIdFromUrl($location.absUrl());
        if (taxId) {
            $scope.currentTax = TaxResource.get({id: taxId});
        }
    }
]);