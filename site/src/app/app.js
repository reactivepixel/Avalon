var app = angular.module("app", [
	"html-templates",
	"ngRoute",
	"firebase"
])

.config(function ($routeProvider, $locationProvider) {
	$routeProvider
	.when("/signup", {
		templateUrl: "validation/signup.tpl.html",
		controller: "NavigationCtrl"
	})
	.when("/login", {
		templateUrl: "validation/login.tpl.html",
		controller: "NavigationCtrl"
	})
	.when("/home", {
		controller: "NavigationCtrl"
	});
		
	$locationProvider.html5Mode(true);
})

.controller("NavigationCtrl", function ($scope, $route, $routeParams, $location, $rootScope) {
//	$scope.$route = $route;
//	$scope.$location = $location;
//	$scope.$routeParams = $routeParams;
	
	console.log($rootScope.auth);
})

.run(function (FBURL, $firebaseAuth, $rootScope) {
	$rootScope.auth = $firebaseAuth(new Firebase(FBURL));
})

.constant("FBURL", "https://avalon-app.firebaseio.com/");