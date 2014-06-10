skeletonControllers.controller('UserDetailsCtrl', ['$scope', '$location', '$window', 'User', 'Utils',
    function($scope, $location, $window, User, Utils) {
        $scope.currentUser = null;

        $scope.deleteUser = function() {
            if(confirm(_p("Do you really want to delete '%1'?", [$scope.currentUser.firstName + " " + $scope.currentUser.lastName + " <" + $scope.currentUser.email + ">"]))) {
                // Send DELETE command
                $scope.currentUser.$delete({}, function() {
                    // On success, go back to the list
                    $window.history.back();
                });
            }
        };

        $scope.$watch('currentUser', function(newvalue, oldvalue) {
            if(newvalue && oldvalue && newvalue.$resolved && oldvalue.$resolved)
                angular.forEach(newvalue, function(value, field) {
                    if(field.indexOf('$$') === -1 && typeof value !== "object" && value !== oldvalue[field]) {
                        var temp = new User();
                        temp[field] = value;

                        temp.$update({id: newvalue.id});
                    }
                });
        }, true);

        // Load as soon as possible.
        // We are not using angularjs routing. We need to parse the url ourselves.
        var userId = Utils.getIdFromUrl($location.absUrl());
        if(userId) {
            $scope.currentUser = User.get({id: userId});
        }
    }
]);
