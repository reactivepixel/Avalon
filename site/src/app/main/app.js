var app = angular.module("app", [
	"html-templates",
	"ngRoute",
	"firebase",
	"userData",
    "landing",
    "userPage"
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
	})
	.when("/user", {
		templateUrl: "content/userpage.tpl.html"
	})
    .when("/toptracks", {
        templateUrl: "content/toptracks.tpl.html"
    })
    .when("/artists", {
        templateUrl: "content/artists.tpl.html"
    })
    .when("/explore", {
        templateUrl: "content/explore.tpl.html"
    });
		
	$locationProvider.html5Mode(false);

    SC.initialize({
        client_id: "4ccedb41319a68ce1daa392a3ce5ef55",
        redirect_uri: "http://localhost/"
    });
})

.controller("MainCtrl", function ($scope, $route, $routeParams) {
	
})

.run(function (FBURL, $firebaseAuth, $rootScope, $location, User) {
	$rootScope.auth = $firebaseAuth(new Firebase(FBURL));
	$rootScope.$on("$firebaseAuth:login", function(e, user) {
		User.getSingle(user.id);
		$location.path("/");
	});
	$rootScope.$on("$firebaseAuth:logout", function (e, user) {
		$rootScope.user = null;
		$location.path("/");
	});
})

.constant("FBURL", "https://avalon-app.firebaseio.com/");
