var app = angular.module("app", [
	"html-templates",
	"ngRoute",
	"firebase",
	"userData"
])

.config(function ($routeProvider, $locationProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "main/landing.tpl.html",
		controller: "MainCtrl"
	})
	.when("/signup", {
		templateUrl: "validation/signup.tpl.html"
	})
	.when("/login", {
		templateUrl: "validation/login.tpl.html"
	});
		
	$locationProvider.html5Mode(true);
})

.controller("MainCtrl", function ($scope, $route, $routeParams) {
	
})

.run(function (FBURL, $firebaseAuth, $rootScope, $location) {
	$rootScope.auth = $firebaseAuth(new Firebase(FBURL));
	$rootScope.$on("$firebaseAuth:login", function(e, user) {
		$location.path("/");
	});
})

.constant("FBURL", "https://avalon-app.firebaseio.com/");
