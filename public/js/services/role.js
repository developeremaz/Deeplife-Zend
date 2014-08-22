skeletonServices
    .service('RoleResource', ['$resource',
        function ($resource) {
            return $resource('/api/roles/:id');
        }
    ])

    .service('RoleService', ['RoleResource', '$q',
        function(RoleResource, $q) {
            var roles = [], currentRole = null, currentRoleId = null;

            this.get = function() {
                return RoleResource.get({ id: id }).$promise;
            };

            this.query = function() {
                var defer = $q.defer();

                if(roles && roles.length) {
                    defer.resolve(roles);
                } else {
                    RoleResource.query().$promise
                        .then(function(data) {
                            roles = data;
                            defer.resolve(roles);
                        }
                    );
                }

                return defer.promise;
            };

            this.delete = function(role) {
                var defer = $q.defer();

                var temp = new RoleResource();
                temp.$delete({id:role.id}, function(data) {
                    angular.forEach(roles, function(u, index) {
                        if(role.id === u.id) {
                            roles.splice(index, 1);
                        }
                    });

                    defer.resolve(roles);
                });

                return defer.promise;
            };

            this.create = function(data) {
                var defer = $q.defer();

                var temp = new RoleResource(data);
                temp.$save(null, function(data) {
                    roles.push(data);

                    defer.resolve(roles);
                });

                return defer.promise;
            };
        }
    ]);
