app.factory('Product', function($q, $http, $rootScope){
	var factory = { products : false };

	factory.all = function () {
		var defer = $q.defer();
		if ( factory.products == false ) {
			$http.get( $rootScope.api.produits )
			     .success( function(data, status){
			     	factory.products = data;
			     	defer.resolve( data );
			     })
			     .error( function(data, status) {
			     	defer.reject('Impossible de rejoindre le serveur!');
			     });
		} else {
			defer.resolve( factory.products );
		}
		return defer.promise;
	};

	factory.get = function ( $ref ) {
		var product = {};
		var defer = $q.defer();
		factory.all().then(function ( data ){
			angular.forEach(data, function(value, key){
				if ( value.reference == $ref ) {
					product == value;
				}
			});
			defer.resolve(product);
		}, function ( error ){ defer.reject(error); });
		return defer.promise;
	}

	return factory;
});