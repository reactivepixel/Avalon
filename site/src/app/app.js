var app = angular.module("app", [
	"html-templates",
	"ngRoute",
	"firebase"
])

.config(function ($routeProvider, $locationProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "default.tpl.html",
		controller: "NavigationCtrl"
	})
	.when("/signup", {
		templateUrl: "validation/signup.tpl.html"
	})
	.when("/login", {
		templateUrl: "validation/login.tpl.html"
	});
		
	$locationProvider.html5Mode(true);
})

.controller("NavigationCtrl", function ($scope, $route, $routeParams) {
	
})

.run(function (FBURL, $firebaseAuth, $rootScope, $location) {
	$rootScope.auth = $firebaseAuth(new Firebase(FBURL));

	$rootScope.$on("$firebaseAuth:login", function(e, user) {
	    console.log("User " + user.id + " successfully logged in!");
		$location.path("/");
	});
})

.constant("FBURL", "https://avalon-app.firebaseio.com/");
