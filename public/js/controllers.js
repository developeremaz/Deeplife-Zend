'use strict';

/* Controllers */

var skeletonControllers = angular.module('skeleton.controllers', []);

// Here we set global functions available to all the controllers and scopes.
// Theses functions are used throughout the app and we don't want to clutter
// the controllers, so we store them in a global place.
skeletonControllers.run(['$rootScope', 'Utils', function($rootScope, Utils) {
    $rootScope.openModal = Utils.openModal;

    $rootScope.goto = function(location) {
        window.location.href = location;
    };
}]);
