skeletonServices.factory('User', ['$resource',
    function ($resource) {
        return $resource('/api/users/:id', {id: '@id'}, {
            query: {method: 'GET', isArray: false},
            update: {method: 'PUT'}
        });
    }
]);

skeletonServices.factory('Role', ['$resource',
    function ($resource) {
        return $resource('/api/roles/:id', {id: '@id'}, {
            query: {method: 'GET', isArray: false},
            update: {method: 'PUT'}
        });
    }
]);
