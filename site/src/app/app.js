var app = angular.module("app", [
	"html-templates",
	"ngRoute"
])

.config(function ($routeProvider, $locationProvider) {
	$routeProvider
	.when("/signup", {
		templateUrl: "validation/signup.tpl.html",
		controller: NavigationCtrl
	})
	.when("/login", {
		templateUrl: "validation/login.tpl.html",
		controller: NavigationCtrl
	});
		
	$locationProvider.html5Mode(true);
});

function NavigationCtrl ($scope, $route, $routeParams, $location) {	
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
}