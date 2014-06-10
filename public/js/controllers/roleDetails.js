skeletonControllers.controller('RoleDetailsCtrl', ['$scope', '$location', '$timeout', 'Role', 'Utils',
    function($scope, $location, $timeout, Role, Utils) {
        $scope.currentRole = null;
        $scope.availableRoles = null;

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
                        });
                    }
                });
            }
        };

        $scope.$watch('currentRole', function(newvalue, oldvalue) {
            if(newvalue && oldvalue && newvalue.$resolved && oldvalue.$resolved)
                angular.forEach(newvalue, function(value, field) {
                    if(field.indexOf('$$') === -1 && typeof value !== "object" && value !== oldvalue[field]) {
                        var temp = new Role();
                        temp[field] = value;

                        temp.$update({id: newvalue.id});
                    }
                });
        }, true);

        // Load as soon as possible.
        // We are not using angularjs routing. We need to parse the url ourselves.
        var roleId = Utils.getIdFromUrl($location.absUrl());
        if(roleId) {
            $scope.currentRole = Role.get({id: roleId}, function(response) {
                Role.query({}, function(resp) {
                    $scope.availableRoles = Utils.formatDataToSelect(resp.roles, 'roleId', $scope.currentRole.parent);
                });
            });
        }
    }
]);