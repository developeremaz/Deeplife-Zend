skeletonServices.factory('Role', ['$resource',
    function ($resource) {
        return $resource('/api/roles/:id');
    }
]);