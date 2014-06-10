skeletonControllers.controller('UserCtrl', ['$scope', '$filter', 'User', 'Utils', 'ngTableParams',
    function($scope, $filter, User, Utils, ngTableParams) {
        $scope.users = [];
        $scope.totalUsers = 0;
        $scope.currentUser = null;
        $scope.query = "";
        $scope.enableFilter = false;

        var getData = function() {
            return $scope.users;
        };

        $scope.$watch("query", function (value) {
            $scope.tableParams.filter(value);
        });

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 25,          // count per page
            filter: {},
            sorting: {
                email: 'asc'    // initial sorting
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
            var selectorStr = "#user-create";
            var selector = $(selectorStr);

            // Disable inputs
            Utils.disable(selectorStr + ".modal-footer :input");

            var inputs = selector.find(".modal-body :input");
            var data = Utils.JSONObjFromInputs(inputs);

            // Reset errors
            selector.find(".errors").addClass('hide').html("");

            var user = new User(data);
            user.$save(
                function (success) {
                    // Add it to the user array
                    $scope.users.push(user);
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

        $scope.openModalPassword = function(user) {
            var modal = $("#user-password");
            modal.data("id", user.id).modal("show").find(":input").val("");
        };

        $scope.savePassword = function() {
            var modal = $("#user-password");
            var userId = modal.data("id");
            var button = modal.find("button");
            var password = $("#password");
            var passwordConfirmation = $("#password-confirm");

            // Disable buttons
            button.attr('disabled', 'disabled').blur();

            if (password.val() === "" || password.val() != passwordConfirmation.val()) {
                button.prop('disabled', !button.prop('disabled')).blur();
                return;
            }

            // Find resource and update it
            $scope.users.forEach(function(userResource, index) {
                if (userId === userResource.id) {
                    var temp = new User();
                    temp.password = password.val();
                    temp.$update({id: userId}, function() {
                        // Close modal window
                        modal.modal("hide");

                        // Enable button
                        button.removeAttr('disabled');
                    });
                }
            });
        };

        $scope.openModalRoles = function(user) {
            var modal = $("#user-roles");

            // Open modal window
            modal.data("id", user.id).modal("show")
                .find(".modal-body :input")
                .prop("checked", null);

            // Get selected user roles and check them in the modal window
            console.log(user.roles);
            angular.forEach(user.roles, function(role) {
                modal.find(":input[value='" + role.id + "']").prop("checked", "checked");
            });
        };

        $scope.saveRoles = function() {
            var modal = $("#user-roles");
            var userId = modal.data("id");
            var button = modal.find("button");
            var roles = $.map(modal.find(":input:checked"), function(n) { return $(n).val(); });
            console.log(roles);

            button.attr('disabled','disabled');

            // Find resource and update it
            $scope.users.forEach(function(userResource, index) {
                if (userId === userResource.id) {
                    // Create temp object
                    var temp = new User();
                    temp.roles = roles;

                    temp.$update({id: userId}, function() {
                        userResource.roles = temp.roles;

                        // Close modal window
                        modal.modal("hide");

                        // Enable button
                        button.removeAttr('disabled');
                    });
                }
            });
        };

        $scope.deleteUser = function(user) {
            if(confirm(_p("Do you really want to delete '%1'?", [user.firstName + " " + user.lastName + " <" + user.email + ">"]))) {
                // Find the project to delete
                $scope.users.forEach(function(userResource, index) {
                    if (user.id === userResource.id) {
                        var temp = new User();

                        // Send DELETE command
                        temp.$delete({id:user.id}, function() {
                            // On success, remove the user from the array
                            $scope.users.splice(index, 1);
                            $scope.tableParams.reload();
                        });
                    }
                });
            }
        };

        $scope.$watchCollection('users', function() {
            if($scope.users.length < $scope.totalUsers-1) {
                // We use a temp array so we don't fire a modification each push
                var temp = $scope.users;
                User.query({next: temp.length}, function(response) {
                    angular.forEach(response.users, function(e) {
                        temp.push(e);
                    });

                    // This will trigger the watch again
                    $scope.users = temp;

                    $scope.finishedLoading();
                });
            }
        });

        $scope.finishedLoading = function() {
            // If we are finished loading, flag that we can filter now
            if($scope.users.length >= $scope.totalUsers-1) {
                $scope.enableFilter = true;
                $scope.tableParams.reload();
            }
        };

        // Load as soon as possible.
        User.query({}, function(response) {
            $scope.users = response.users;
            $scope.totalUsers = response.count;
            $scope.finishedLoading();
        });
    }
]);


