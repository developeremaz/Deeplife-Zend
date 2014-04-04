'use strict';

// Declare app level module which depends on filters, and services
var skeleton = angular.module(
    'skeleton',
    [
        'ui.bootstrap',
        'ngTable',

        'skeleton.controllers',
        'skeleton.filters',
        'skeleton.services',
        'skeleton.directives',
    ]
);
