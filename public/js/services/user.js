skeletonServices
    .service('UserResource', ['$resource',
        function ($resource) {
            return $resource('/api/users/:id');
        }
    ])

    .service('UserService', ['UserResource', '$q',
        function(UserResource, $q) {
            var users = [], currentUser = null, currentUserId = null;

            this.get = function() {
                return UserResource.get({ id: id }).$promise;
            };

            this.query = function() {
                var defer = $q.defer();

                if(users && users.length) {
                    defer.resolve(users);
                } else {
                    UserResource.query().$promise
                        .then(function(data) {
                            users = data;
                            defer.resolve(users);
                        }
                    );
                }

                return defer.promise;
            };

            this.delete = function(user) {
                var defer = $q.defer();

                var temp = new UserResource();
                temp.$delete({id:user.id}, function(data) {
                    angular.forEach(users, function(u, index) {
                        if(user.id === u.id) {
                            users.splice(index, 1);
                        }
                    });

                    defer.resolve(users);
                });

                return defer.promise;
            };

            this.create = function(data) {
                var defer = $q.defer();

                var temp = new UserResource(data);
                temp.$save(null, function(data) {
                    users.push(data);

                    defer.resolve(users);
                });

                return defer.promise;
            };
        }
    ]);
