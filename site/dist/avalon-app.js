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

function HeaderCtrl ($scope, $rootScope, $location) {
	
	$scope.logOut = function () {
		if ($rootScope.auth) {
			$rootScope.auth.$logout();
			$location.path("/");
		}
	};
	
	$scope.isLoggedIn = function () {
		if ($rootScope.auth) {
			if ($rootScope.auth.user) {
				return true;
			}
		} else {
			return false;
		}
	}
	
}

function LogInCtrl ($scope, $location, $rootScope, $firebase, $firebaseAuth, FBURL) {
	
	$scope.submit = function (user) {
		if ($scope.logInForm.$valid) {
			$rootScope.auth.$login("password", {
				email: "test@gmail.com",
				password: "testtest0"
			});
		}
		
		if ($scope.user !== undefined) {
			$scope.user.password = null;
		}
	};
	
}

function SignUpCtrl ($scope, $location, $rootScope, $firebase, $firebaseAuth) {
	
	$scope.submit = function (user) {
		if ($scope.signUpForm.$valid) {
			var match = checkPasswordMatch(user.password, user.confirmPassword);
		
			if (!match) {
				window.alert("Passwords must match.");
				resetPasswords();
				return false;
			} else {
				console.log("Valid");
				$rootScope.auth.$createUser(user.email, user.password, 
				function (error, newUser) {
					if (!error) {
						console.log("User ID: " + newUser.id);
						createProfile(user, newUser.id);
					}
				});
				return true;
			}
		} else {
			window.alert("Form is not valid");
			resetPasswords();
			return false;
		}
	};
	
	function checkPasswordMatch(p1, p2) {
		return p1 === p2;
	}
	
	function resetPasswords() {
		if ($scope.user !== undefined) {
			$scope.user.password = null;
			$scope.user.confirmPassword = null;
		}
	}
	
	function createProfile(user, id) {
		var info = {
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName
			};
		
		new Firebase(url).child("users/"+id).set(info, function (err) {
			if (!err) {
				console.log("Success");
			}
		});
	}
	
}

angular.module('html-templates', ['default.tpl.html', 'footer.tpl.html', 'header.tpl.html', 'validation/login.tpl.html', 'validation/signup.tpl.html']);

angular.module("default.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("default.tpl.html",
    "<h2>Avalon is up and running!</h2>");
}]);

angular.module("footer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("footer.tpl.html",
    "<p>Avalon &copy; 2013. All Rights Reserved.</p>");
}]);

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    "<h1><a href=\"\">Avalon</a></h1>\n" +
    "\n" +
    "<form>\n" +
    "	<input type=\"text\" name=\"search\" id=\"search\" placeholder=\"Search\" />\n" +
    "	<button type=\"submit\">Search</button>\n" +
    "</form>\n" +
    "\n" +
    "<div>\n" +
    "	<ul>\n" +
    "		<li><a href=\"signup\">Sign Up</a></li>\n" +
    "		<li ng-show=\"!isLoggedIn()\"><a href=\"login\">Log In</a></li>\n" +
    "		<li ng-show=\"isLoggedIn()\"><a href=\"\" ng-click=\"logOut()\">Log Out</a></li>\n" +
    "	</ul>\n" +
    "</div>\n" +
    "\n" +
    "<nav>\n" +
    "	<ul>\n" +
    "		<li><a href=\"#\">Artists</a></li>\n" +
    "		<li><a href=\"#\">Tracks</a></li>\n" +
    "		<li><a href=\"#\">Videos</a></li>\n" +
    "		<li><a href=\"#\">Events</a></li>\n" +
    "		<li><a href=\"#\">Charts</a></li>\n" +
    "		<li><a href=\"#\">Podcasts</a></li>\n" +
    "	</ul>\n" +
    "</nav>");
}]);

angular.module("validation/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("validation/login.tpl.html",
    "<h2>Log with one of these services&#58;</h2>\n" +
    "\n" +
    "<ul>\n" +
    "	<li><a href=\"#\">Facebook</a></li>\n" +
    "</ul>\n" +
    "\n" +
    "<form name=\"logInForm\" ng-controller=\"LogInCtrl\">\n" +
    "	<fieldset>\n" +
    "		<legend>Type in your user info&#58;</legend>\n" +
    "		<label for=\"username\">Username</label><input type=\"text\" name=\"username\" id=\"username\" placeholder=\"username or email\" ng-model=\"user.username\" autofocus required />\n" +
    "		<label for=\"password\">Password</label><input type=\"password\" name=\"password\" id=\"password\" required ng-model=\"user.password\" />\n" +
    "	</fieldset>\n" +
    "	\n" +
    "	<div>\n" +
    "		<a href=\"index.html\" title=\"Return to Home Page\">cancel</a>\n" +
    "		<button type=\"submit\" ng-click=\"submit(user)\">Log In</button>\n" +
    "	</div>\n" +
    "</form>");
}]);

angular.module("validation/signup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("validation/signup.tpl.html",
    "<h2>Sign up to Avalon&#58;</h2>\n" +
    "\n" +
    "<form name=\"signUpForm\" ng-controller=\"SignUpCtrl\">\n" +
    "	<fieldset>\n" +
    "		<legend>Personal Info</legend>\n" +
    "		<label for=\"firstName\">First Name</label><input type=\"text\" name=\"firstName\" id=\"firstName\" placeholder=\"John\" ng-model=\"user.firstName\" autofocus required />\n" +
    "		<label for=\"lastName\">Last Name</label><input type=\"text\" name=\"lastName\" id=\"lastName\" placeholder=\"Doe\" ng-model=\"user.lastName\" required />\n" +
    "		<label for=\"email\">Email</label><input type=\"email\" name=\"email\" id=\"email\" placeholder=\"johndoe@service.com\" ng-model=\"user.email\" required />\n" +
    "		<label for=\"username\">Username</label><input type=\"text\" name=\"username\" id=\"username\" placeholder=\"johndoe365\" ng-model=\"user.username\" ng-minLength=\"4\" required />\n" +
    "		<label for=\"password\">Password</label><input type=\"password\" name=\"password\" id=\"password\" ng-model=\"user.password\" ng-minLength=\"8\" ng-pattern=\"/^.*(?=.*\\d)(?=.*[a-zA-Z]).*$/\" required />\n" +
    "		<label for=\"confirmPassword\">Confirm Password</label><input type=\"password\" name=\"confirmPassword\" id=\"confirmPassword\" ng-model=\"user.confirmPassword\" required />\n" +
    "	</fieldset>\n" +
    "	\n" +
    "	<p>By clicking the submit button you agree to our <a href=\"#\">Terms of Service</a> &amp; <a href=\"#\">Privacy Policies</a>.</p>\n" +
    "	<div>\n" +
    "		<a href=\"index.html\" title=\"Return to Home Page\">cancel</a>\n" +
    "		<button type=\"submit\" ng-click=\"submit(user)\">Submit</button>\n" +
    "	</div>\n" +
    "</form>");
}]);
