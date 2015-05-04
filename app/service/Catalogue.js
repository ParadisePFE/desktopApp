app.factory('Catalogue', function($q, $http, $rootScope){
	var factory = {catalogue : false};
	factory.get = function () {
		var defer = $q.defer();
		$http.get( $rootScope.api.catalogue )
			 .success(function(data, status){
			 	factory.catalogue = data;
			 	defer.resolve(data);
			 })
			 .error(function (data, status){
			 	defer.reject('Impossible de joindre le serveur!');
			 });
		return defer.promise;
	};

	return factory;
});