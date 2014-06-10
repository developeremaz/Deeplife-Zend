skeletonControllers.controller('RoleCtrl', ['$scope', '$filter', 'Role', 'Utils', 'ngTableParams',
    function($scope, $filter, Role, Utils, ngTableParams) {
        $scope.roles = [];
        $scope.totalRoles = 0;
        $scope.query = "";
        $scope.enableFilter = false;

        var getData = function() {
            return $scope.roles;
        };

        $scope.$watch("query", function (value) {
            $scope.tableParams.filter(value);
        });

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 25,          // count per page
            filter: {},
            sorting: {
                roleId: 'asc'    // initial sorting
            }
        }, {
            total: function () { return getData().length; }, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var filteredData = params.filter() ? $filter('filter')(getData(), params.filter()) : getData();
                var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

                params.total(orderedData.length); // set total for recalc pagination

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: { $data: {} }
        });

        $scope.create = function() {
            // Disable inputs
            Utils.disable("#role-create .modal-footer :input");

            var inputs = $("#role-create .modal-body :input");
            var data = Utils.JSONObjFromInputs(inputs);

            //ajax action to add element
            $("#role-create").find(".errors").addClass('hide').html("");

            var role = new Role(data);
            role.$save(
                function (success) {
                    // Add it to the role array
                    $scope.roles.push(role);
                    $scope.tableParams.reload();

                    $scope.query = "";

                    $("#role-create").modal('hide');

                    // Disable inputs and reset form
                    Utils.disable("#role-create .modal-footer :input");
                    $("#role-create form")[0].reset();
                },
                function (error) {
                    Utils.formErrorMessages(error.data.messages, inputs);
                    Utils.disable("#role-create .modal-footer :input");
                }
            );
        };

        $scope.deleteRole = function(role) {
            if(confirm(_p("Do you really want to delete '%1'?", [role.roleId]))) {
                // Find the project to delete
                $scope.roles.forEach(function(roleResource, index) {
                    if (role.id === roleResource.id) {
                        var temp = new Role();

                        // Send DELETE command
                        temp.$delete({id:role.id}, function() {
                            // On success, remove the role from the array
                            $scope.roles.splice(index, 1);
                            $scope.tableParams.reload();
                        });
                    }
                });
            }
        };

        $scope.$watchCollection('roles', function() {
            if($scope.roles.length < $scope.totalRoles-1) {
                // We use a temp array so we don't fire a modification each push
                var temp = $scope.roles;
                Role.query({next: temp.length}, function(response) {
                    angular.forEach(response.roles, function(e) {
                        temp.push(e);
                    });

                    // This will trigger the watch again
                    $scope.roles = temp;

                    $scope.finishedLoading();
                });
            }
        });

        $scope.finishedLoading = function() {
            // If we are finished loading, flag that we can filter now
            if($scope.roles.length >= $scope.totalRoles-1) {
                $scope.enableFilter = true;
                $scope.tableParams.reload();
            }
        };

        // Load as soon as possible.
        Role.query({}, function(response) {
            $scope.roles = response.roles;
            $scope.totalRoles = response.count;
            $scope.finishedLoading();
        });
    }
]);