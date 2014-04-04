skeletonServices.factory('Tax', ['$resource',
    function ($resource) {
        return $resource('/api/taxes/:id', {id: '@id'}, {
            query: {method: 'GET', isArray: false},
            update: {method: 'PUT'}
        });
    }
]);
