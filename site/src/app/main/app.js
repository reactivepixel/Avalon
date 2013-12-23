var app = angular.module("app", [
	"html-templates",
	"ngRoute",
	"firebase",
	"userData",
    "userPage",
    "authentication"
])

.config(function ($routeProvider, $locationProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "main/landing.tpl.html",
		controller: "MainCtrl"
	})
	.when("/user", {
		templateUrl: "content/userpage.tpl.html"
	})
    .when("/explore", {
        templateUrl: "content/explore.tpl.html"
    });
		
	$locationProvider.html5Mode(false);
    
    // Initialize the SoundCloud SDK
    SC.initialize({
        client_id: "4ccedb41319a68ce1daa392a3ce5ef55",
        redirect_uri: "http://localhost/"
    });
})

.controller("MainCtrl", function ($scope) {
	// Main Controller for the app.
})

.run(function (FBURL, $firebaseAuth, $rootScope, $location, User) {
    // As soon as the application initializes lets start the auth object and give it some event listeners.
	$rootScope.auth = $firebaseAuth(new Firebase(FBURL));
	$rootScope.$on("$firebaseAuth:login", function(e, user) {
		User.getSingle(user.id);  // Get the data of the user that just logged in. 
		$location.path("/");
	});
	$rootScope.$on("$firebaseAuth:logout", function (e, user) {
		$rootScope.user = null;   // Set user to null so program knows the user is not logged in.
		$location.path("/");
	});
}) 

.constant("FBURL", "https://avalon-app.firebaseio.com/");   // The url reference for the database.
