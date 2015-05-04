app.controller('SidebarController', function(Category, Catalogue, $scope, $rootScope){
	// init catalogue property 
	Catalogue.get().then( 
		function ( data ) { $scope.catalogue = data; }, 
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
		}, 
		function ( error ) { console.log( error ); }	
	);
});