function AddCtrl() {
    
}

function UserPageCtrl($scope, $rootScope) {
    
    $scope.linkSC = function () {
        SC.connect(function () {
            SC.get("/me", function(me) {
                $rootScope.userSC = me;
            });
        });
    };
    
    $scope.getMyStuff = function () {
        $scope.template = "content/mystuff.tpl.html";
        SC.get("/me/tracks", function (tracks) {
            $scope.$apply(function () {
                $scope.myTracks = tracks;
            });
        });            
    };
    
    $scope.myTracks = [];
    
    $scope.template = "";
    
}

angular.module("userData", [])
	.factory("User", function (FBURL, Firebase, $rootScope, $firebase) {
		return {
			getSingle: function (userId) {				
                $rootScope.user = $firebase(new Firebase(FBURL+"users/"+userId));
			},
			getCollection: function () {
				
			}
		};
	});

var app = angular.module("app", [
	"html-templates",
	"ngRoute",
	"firebase",
	"userData",
    "landing"
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
	});
		
	$locationProvider.html5Mode(true);

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

function HeaderCtrl ($scope, $rootScope, $location, $firebase, FBURL, User, $firebaseAuth) {
	
	$scope.logOut = function () {
		if ($rootScope.auth) {
			$rootScope.auth.$logout();
		}
	};
	
	$scope.redirectHome = function () {
		$location.path("/");	
	};
	
}

angular.module("landing", [])

.config(function () {
	
})

.controller("LandingCtrl", function ($scope) {

	SC.get("/tracks", {genres: 'trance'}, function (tracks) {
		var len = tracks.length,
			max = (len > 10) ? 10 : len,
			i = 0,
			items = [];
		
		for (i = 0 ; i < max; i++) {
			items[i] = tracks[i];
		}
		
		$scope.$apply(function () {
			$scope.items = items;
		});
	});
	
});

function LogInCtrl ($scope, $rootScope, $location, $firebase, $firebaseAuth, FBURL) {
	
	$scope.submit = function (user) {
		if ($scope.logInForm.$valid) {
			$rootScope.auth.$login("password", {
				email: user.username,
				password: user.password
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

angular.module('html-templates', ['content/add.tpl.html', 'content/mystuff.tpl.html', 'content/userpage.tpl.html', 'main/footer.tpl.html', 'main/header.tpl.html', 'main/landing.tpl.html', 'validation/login.tpl.html', 'validation/signup.tpl.html']);

angular.module("content/add.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("content/add.tpl.html",
    "<form name=\"addForm\" ng-controller=\"AddCtrl\">\n" +
    "	<fieldset>\n" +
    "		<legend>Add...</legend>\n" +
    "		\n" +
    "	</fieldset>	\n" +
    "</form>");
}]);

angular.module("content/mystuff.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("content/mystuff.tpl.html",
    "<h4>Your Stuff</h4>\n" +
    "\n" +
    "<ul id=\"widgets\">\n" +
    "<!--<li ng-repeat=\"track in myTracks\">{{track.duration}}</li>-->\n" +
    "</ul>");
}]);

angular.module("content/userpage.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("content/userpage.tpl.html",
    "<h2>This is the user page.</h2>\n" +
    "\n" +
    "<section ng-controller=\"UserPageCtrl\">\n" +
    "    <h3>Your Content</h3>\n" +
    "    <p><a href=\"\" ng-click=\"linkSC()\">Log in to your SoundCloud to add tracks!</a></p>\n" +
    "    \n" +
    "    <ul>\n" +
    "        <li><a href=\"\" ng-click=\"getMyStuff()\">My Stuff</a></li>\n" +
    "        <li><a href=\"\" ng-click=\"template = 'content/add.tpl.html'\">Add</a></li>\n" +
    "    </ul>\n" +
    "    \n" +
    "    <div ng-include=\"template\"></div>\n" +
    "    \n" +
    "</section>");
}]);

angular.module("main/footer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("main/footer.tpl.html",
    "<p>Avalon &copy; 2013. All Rights Reserved.</p>");
}]);

angular.module("main/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("main/header.tpl.html",
    "<h1><a href=\"\" ng-click=\"redirectHome()\">Avalon</a></h1>\n" +
    "\n" +
    "<form>\n" +
    "	<input type=\"text\" name=\"search\" id=\"search\" placeholder=\"Search\" />\n" +
    "	<button type=\"submit\">Search</button>\n" +
    "</form>\n" +
    "\n" +
    "<div>\n" +
    "	<ul>\n" +
    "		<li ng-show=\"!user\"><a href=\"signup\">Sign Up</a></li>\n" +
    "		<li ng-show=\"!user\"><a href=\"login\">Log In</a></li>\n" +
    "		<li ng-show=\"user\">Welcome! <a href=\"user\" ng-bind=\"user.username\"></a></li>\n" +
    "		<li ng-show=\"user\"><a href=\"\" ng-click=\"logOut()\">Log Out</a></li>\n" +
    "	</ul>\n" +
    "</div>\n" +
    "\n" +
    "<nav>\n" +
    "	<ul>\n" +
    "		<li><a href=\"#\">Artists</a></li>\n" +
    "		<li><a href=\"#\">Tracks</a></li>\n" +
    "		<li><a href=\"#\">Videos</a></li>\n" +
    "	</ul>\n" +
    "</nav>");
}]);

angular.module("main/landing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("main/landing.tpl.html",
    "<h2>Avalon is up and running!</h2>\n" +
    "\n" +
    "<ul ng-controller=\"LandingCtrl\">\n" +
    "	<li ng-repeat=\"item in items\">{{item.title}}</li>\n" +
    "</ul>");
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
