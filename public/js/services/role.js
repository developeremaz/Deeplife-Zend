skeletonServices.factory('Role', ['$resource',
    function ($resource) {
        return $resource('/api/roles/:id', {id: '@id'}, {
            query: {method: 'GET', isArray: false},
            update: {method: 'PUT'}
        });
    }
]);