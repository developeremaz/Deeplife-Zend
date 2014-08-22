skeletonServices
    .service('TaxResource', ['$resource',
        function ($resource) {
            return $resource('/api/taxes/:id');
        }
    ])

    .service('TaxService', ['TaxResource', '$q',
        function(TaxResource, $q) {
            var taxes = [], currentTax = null, currentTaxId = null;

            this.get = function(params) {
                var defer = $q.defer();

                if(currentTax && currentTaxId === id) {
                    defer.resolve(currentTax);
                } else {
                    TaxResource.get(params, function(data) {
                        currentTax = data;
                        currentTaxId = params.id ? params.id : null;

                        defer.resolve(currentTax);
                    });
                }

                return defer.promise;
            };

            this.query = function() {
                var defer = $q.defer();

                if(taxes && taxes.length) {
                    defer.resolve(taxes);
                } else {
                    TaxResource.query().$promise
                        .then(function(data) {
                            taxes = data;
                            defer.resolve(taxes);
                        }
                    );
                }

                return defer.promise;
            };

            this.delete = function(tax) {
                var defer = $q.defer();

                var temp = new TaxResource();
                temp.$delete({id:tax.id}, function(data) {
                    angular.forEach(taxes, function(u, index) {
                        if(tax.id === u.id) {
                            taxes.splice(index, 1);
                        }
                    });

                    defer.resolve(taxes);
                });

                return defer.promise;
            };

            this.create = function(data) {
                var defer = $q.defer();

                var temp = new TaxResource(data);
                temp.$save(null, function(data) {
                    taxes.push(data);

                    defer.resolve(taxes);
                });

                return defer.promise;
            };

            this.update = function(tax, data) {
                var defer = $q.defer();

                if(tax.id === currentTax.id) {
                    var temp = new TaxResource();
                    temp.$update(data, function(data) {
                        currentTax = data;
                        defer.resolve(currentTax);
                    });
                } else {
                    // Find it in the list and update it
                }

                return defer.promise;
            };
        }
    ]);

