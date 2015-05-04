app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider',function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'app/partials/main.html',
		controller: 'MainController'
	})
	.otherwise({ redirectTo: '/' });
}]);

// define some global vars
app.run( function ( $rootScope ) {
	$rootScope.loading    = false; 
	$rootScope.api = {
		'categories': 'http://127.1.1.1:8080/categories',
		'produits'  : 'http://127.1.1.1:8080/products',
		'catalogue' : 'http://127.1.1.1:8080/catalogue',
	};
});