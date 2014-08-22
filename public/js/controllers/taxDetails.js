skeletonControllers.controller('TaxDetailsCtrl', ['$scope', '$location', '$window', 'TaxService', 'Utils',
    function($scope, $location, $window, TaxService, Utils) {
        $scope.currentTax = null;

        $scope.deleteTax = function() {
            if(confirm(_p("Do you really want to delete '%1'?", [$scope.currentTax.title]))) {
                TaxService.delete($scope.currentTax).then(function(taxes) {
                    $window.history.back();
                });
            }
        };

        // Watch for modification and send an update to the backend
        $scope.$watch('currentTax', function(newvalue, oldvalue) {
            if(newvalue && oldvalue && newvalue.$resolved && oldvalue.$resolved)
                angular.forEach(newvalue, function(value, field) {
                    if(field.indexOf('$$') === -1 && typeof value !== "object" && value !== oldvalue[field]) {
                        var data = {};
                        data.id = newvalue.id;
                        data[field] = value;

                        TaxService.update($scope.currentTax, data).then(function(tax) {
                            $scope.currentTax = tax;
                        });
                    }
                });
        }, true);

        // Load as soon as possible.
        // We are not using angularjs routing. We need to parse the url ourselves.
        var taxId = Utils.getIdFromUrl($location.absUrl());
        if (taxId) {
            TaxService.get({id: taxId}).then(function(tax) {
                $scope.currentTax = tax;
            });
        }
    }
]);
