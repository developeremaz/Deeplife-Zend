skeletonControllers.controller('UserCtrl', ['$scope', '$q', 'UserService', 'Utils',
    function($scope, $q, UserService, Utils) {
        $scope.users = [];
        $scope.totalUsers = 0;
        $scope.query = "";
        $scope.enableFilter = false;

        var getData = function() {
            return $scope.users;
        };

        $scope.$watch("query", function (value) {
            $scope.tableParams.filter(value);
        });

        $scope.tableParams = Utils.createNgTable({sorting:{email:'asc'}}, getData);

        $scope.create = function() {
            var selector = "#user-create";
            var inputs = $(selector).find(".modal-body :input");
            var data = Utils.JSONObjFromInputs(inputs);
            var createPromise = UserService.create(data);

            Utils.create(selector, createPromise);

            createPromise.then(function(users) {
                $scope.users = users;
                $scope.tableParams.reload();
            });
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
                UserService.delete(user).then(function(users) {
                    $scope.users = users;
                    $scope.tableParams.reload();
                });
            }
        };

        $scope.finishedLoading = function(users) {
            $scope.enableFilter = true;
            $scope.tableParams.reload();
        };

        // Load as soon as possible.
        var queryPromise = UserService.query();

        queryPromise.then(function(users) {
            $scope.users = users;
        });

        $q.all([queryPromise]).then(function(data) {
            $scope.finishedLoading();
        });
    }
]);


