app.controller('MainController', function(Category, Catalogue, $scope, $rootScope){
	$scope.catalogue = {};
	$scope.categories = [];
	// init catalogue property 
	Catalogue.get().then( 
		function ( data ) { $scope.catalogue = data; console.log($scope.catalogue);}, 
		function ( error ) { console.log( error ); }
	);

	// init categories property
	Category.all().then( 
		function ( data ) { 
			$scope.categories = data;

			angular.forEach($scope.categories, function(value, key){
				$scope.categories[ key ].products = null;
				Category.relatedProducts( value.id ).then( function ( data ){
					$scope.categories[ key ].products = data;
				}, function ( error ) { console.log( error ); });
			});

			console.log($scope.categories);
		}, 
		function ( error ) { console.log( error ); }	
	);
});