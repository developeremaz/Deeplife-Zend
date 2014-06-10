skeletonServices
    .service('TaxResource', ['$resource',
        function ($resource) {
            return $resource('/api/taxes/:id');
        }
    ])

    .service('TaxService', ['TaxResource',
        function(TaxResource) {
            this.getTax = function(id) {
                return TaxResource.get({ id: id }).$promise;
            };
            this.queryTax = function(id) {
                return TaxResource.query().$promise;
            };
        }
    ]);
