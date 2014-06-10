skeletonControllers.controller('TaxCtrl', ['$scope', '$filter', 'Tax', 'Utils', 'ngTableParams',
    function($scope, $filter, Tax, Utils, ngTableParams) {
        $scope.taxes = [];
        $scope.totalTaxes = 0;
        $scope.query = "";
        $scope.enableFilter = false;
        $scope.opened = false;

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        var getData = function() {
            return $scope.taxes;
        };

        $scope.$watch("query", function (value) {
            $scope.tableParams.filter(value);
        });

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 25,          // count per page
            filter: {},
            sorting: {
                code: 'asc'    // initial sorting
            }
        }, {
            total: function () { return getData().length; }, // length of data
            getData: function($defer, params) {
                var temp = getData();

                if(temp) {
                    // use build-in angular filter
                    var filteredData = params.filter() ? $filter('filter')(temp, params.filter()) : temp;
                    var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

                    params.total(orderedData.length); // set total for recalc pagination

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            },
            $scope: { $data: {} }
        });

        $scope.create = function() {
            var selectorStr = "#tax-create";
            var selector = $(selectorStr);

            // Disable inputs
            Utils.disable(selectorStr + ".modal-footer :input");

            var inputs = selector.find(".modal-body :input");
            var data = Utils.JSONObjFromInputs(inputs);

            // Reset the errors
            selector.find(".errors").addClass('hide').html("");

            var tax = new Tax(data);
            tax.$save(
                function (success) {
                    // Add it to the tax array
                    $scope.taxes.push(tax);
                    $scope.tableParams.reload();

                    // Clear search field
                    $scope.query = "";

                    // Disable inputs and reset form
                    Utils.disable(selectorStr + ".modal-footer :input");
                    selector.find("form")[0].reset();
                    selector.modal('hide');
                },
                function (error) {
                    Utils.formErrorMessages(error.data.messages, inputs);
                    Utils.disable(selectorStr + ".modal-footer :input");
                }
            );
        };

        $scope.deleteTax = function(tax) {
            if(confirm(_p("Do you really want to delete '%1'?", [tax.title]))) {
                // Find the project to delete
                $scope.taxes.forEach(function(taxResource, index) {
                    if (tax.id === taxResource.id) {
                        // We don't have a resource here, create one
                        var res = new Tax();

                        // Send DELETE command
                        res.$delete({id:tax.id}, function() {
                            // On success, remove the tax from the array
                            $scope.taxes.splice(index, 1);
                            $scope.tableParams.reload();
                        });
                    }
                });
            }
        };

        $scope.$watchCollection('taxes', function() {
            if($scope.taxes.length < $scope.totalTaxes-1) {
                // We use a temp array so we don't fire a modification each push
                var temp = $scope.taxes;
                Tax.query({next: temp.length}, function(response) {
                    angular.forEach(response.taxes, function(e) {
                        temp.push(e);
                    });

                    // This will trigger the watch again
                    $scope.taxes = temp;

                    $scope.finishedLoading();
                });
            }
        });

        $scope.finishedLoading = function() {
            // If we are finished loading, flag that we can filter now
            if($scope.taxes.length >= $scope.totalTaxes-1) {
                $scope.enableFilter = true;
                $scope.tableParams.reload();
            }
        };

        // Load as soon as possible.
        Tax.query({}, function(response) {
            $scope.taxes = response.taxes;
            $scope.totalTaxes = response.count;
            $scope.finishedLoading();
        });
    }
]);

