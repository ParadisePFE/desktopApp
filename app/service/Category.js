app.factory('Category', function($q, $http, $rootScope){
	var factory = { categories: false };
	factory.all = function () {
		var defer = $q.defer();
		if ( factory.categories == false ) {
			$http.get( $rootScope.api.categories )
			     .success ( function ( data, status ) {
					factory.categories = data;
					defer.resolve( data );
				 })
				 .error ( function ( data, status ) {
					defer.reject('Impossible de joindre le serveur!');
				 });
		} else {
			defer.resolve( factory.categories );
		}
		return defer.promise;
	};

	factory.relatedProducts = function ( cat_id ) {
		var defer = $q.defer();
		var route = $rootScope.api.categories + '/' + cat_id + '/products';
		$http.get( route )
			 .success ( function ( data, status ) {
			 	defer.resolve( data );
			 })
			 .error ( function ( data, status ) { 
			 	defer.reject('Impossible de joindre le serveur!'); 
			 });
		return defer.promise;
	};

	factory.findOne = function ( cat_id ) {
		var defer = $q.defer();
		var category = {};
		factory.all().then(function ( data ) {
			
			angular.forEach(data, function(value, key){
				if ( value.id == cat_id ) {
					category = value ;
				}
			});
			defer.resolve(category);

		}, function ( error ){ defer.reject(error); });
		return defer.promise;
	};

	return factory;
});