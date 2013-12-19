function AddCtrl($scope, $rootScope, FBURL) {
    
    $scope.isTrack = false;
    $scope.isVideo = false;
    $scope.genres = [{name: "Trance"}, {name: "Talk"}, {name: "House"}];
    $scope.track = {};
    $scope.time = "0.00";
    $scope.video = {};
    
    $scope.changeType = function (type) {
        if (type === "track") {
            $scope.isTrack = true;
            $scope.isVideo = false;
        } else if (type === "video") {
            $scope.isVideo = true;
            $scope.isTrack = false;
        }
    };
    
    $scope.record = function () {
        console.log("recording");
        SC.record({
            progress: function(ms, avgPeak) {
                getTime(ms);
            }
        });
    };
    
    $scope.stop = function () {
        console.log("stopping");
        SC.recordStop();
    };
    
    $scope.add = function (track) {
        
        if (track.title !== undefined && track.genre !== undefined) {
            console.log("Test Passed");
        } else {
            console.log("Test Failed");
        }
        
        SC.connect({
            connected: function () {
                console.log("Uploading...");
                
                SC.recordUpload({
                    track: {
                        title: track.title,
                        genre: track.genre.name,
                        sharing: "public"
                    }
                }, function (track) {
                    console.log("Uploaded: " + track.permalink_url);
                    
                    var fb = new Firebase(FBURL + "content/" + $rootScope.auth.user.id),
                        newTrack = {
                            title: track.title,
                            genre: track.genre,
                            url: track.permalink_url,
                            type: "track"
                        };
                    
                    fb.push(newTrack);
                });
            }
        });
    };
    
    $scope.play = function () {
        console.log("playing");
        
//        updateTimer(0);
        SC.recordPlay({
            progress: function(ms) {
//                updateTimer(ms);
            }
        });
    };
    
    $scope.addVideo = function (video) {        
        if (checkFields(video)) {
            var fb = new Firebase(FBURL + "content/" + $rootScope.auth.user.id),
                newVideo = {
                    title: video.title,
                    genre: video.genre.name,
                    type:  video.type,
                    url:   video.url,
                    username: $rootScope.user.username
                };
            fb.push(newVideo);
        }
    };
        
    function checkFields(video) {
        
        if (video.title !== undefined && video.genre !== undefined && video.type !== undefined && video.url !== undefined) {
            return true;
        }
        
        return false;
    }
    
    function getTime(ms) {
        $scope.time = SC.Helper.millisecondsToHMS(ms);
    }
    
}

function ArtistsCtrl($scope, FBURL, $sce, $rootScope) {
    
    $scope.content = [];
    $scope.comments = [];
    
    $scope.searchArtist = function () {
        $scope.content = [];
        searchUser($scope.artistName);
    };
    
    function searchUser(user) {
        new Firebase(FBURL+"users/")
            .once("value", function (snapshot) {
                var id = snapshot.forEach(function (child) {
                    if (child.val().username === user) {
                        return child.name();
                    }
                });
                getData(id);
            });
    }
    
    function getData(id) {
        new Firebase(FBURL+"content/"+id)
            .once("value", function (snapshot) {
                snapshot.forEach(function (child) {
                    
                    var data = child.val();
                    data.id = child.name();
                    
                    if (data.type === "youtube" || data.type === "vimeo") {
                        $scope.$apply(function () {
                            if (data.type === "youtube") {
                                data.embed = "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
                            } else if (data.type === "vimeo") {
                                data.embed = "<iframe src='//player.vimeo.com/video/"+data.url+"' width='640' height='360' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
                            } 
                            data.commentsEnabled = true;
                            $scope.content.push(data);
                        });
                    }
                    
                    if (data.type === "track") {
                        SC.oEmbed(data.url, { auto_play: false }, function(oEmbed) {
                            $scope.$apply(function () {
                                data.embed = oEmbed.html;
                                $scope.content.push(data);
                            });
                        });
                    }
                });
            });
    }
    
    $scope.render = function (text) {
        if (text !== undefined) {
            return $sce.trustAsHtml(text);
        }
    };
    
    $scope.addComment = function (text, that) {
        var ref = new Firebase(FBURL+"comments/"+that+"/");
        ref.push(text);
    };
    
    $scope.showComments = function (that) {
        var ref = new Firebase(FBURL+"comments/"+that+"/");
        ref.once("value", function (snapshot) {
            snapshot.forEach(function (child) {
                $scope.$apply(function () {
                    $scope.comments.push(child.val());
                });
            });
        });
    }; 
}
function TopTracksCtrl () {
    
    SC.get("/tracks", {limit: 10}, function (tracks) {
        
        var container = document.getElementById("topTracks");
        
        for (var i = 0, max = tracks.length; i < max; i++) {
            SC.oEmbed(tracks[i].permalink_url, {}, function (oEmbed) {
                if (oEmbed !== null) {
                    container.innerHTML += oEmbed.html;
                }
            });
        }
    });
    
}

angular.module("userPage", ["ngSanitize"])

.controller("UserPageCtrl" ,function UserPageCtrl($scope, $rootScope, $firebase, FBURL, $sce) {
    
    $scope.template = "";
    $scope.content = [];
   
//    $scope.linkSC = function () {
//        SC.connect(function () {
//            SC.get("/me", function(me) {
//                $rootScope.userSC = me;
//            });
//        });
//    };
    
    $scope.getMyStuff = function () {
        $scope.template = "content/mystuff.tpl.html"; 
        $scope.content = [];
        
        var content = new Firebase(FBURL + "content/" + $rootScope.auth.user.id);
        
        content.on('child_added', function(snapshot) {
            var data = snapshot.val();
            data.id = snapshot.name();
            
            if (data.type === "youtube" || data.type === "vimeo") {
                $scope.$apply(function () {
                    if (data.type === "youtube") {
                        data.embed = "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
                    } else if (data.type === "vimeo") {
                        data.embed = "<iframe src='//player.vimeo.com/video/"+data.url+"' width='640' height='360' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
                    } 
                    $scope.content.push(data);
                });
            }
            
            if (data.type === "track") {
                SC.oEmbed(data.url, { auto_play: false }, function(oEmbed) {
                    $scope.$apply(function () {
                        data.embed = oEmbed.html;
                        $scope.content.push(data);
                    });
                });
            }
        });
    };
    
    $scope.remove = function (id) {
        var ref = new Firebase(FBURL+"content/"+$rootScope.auth.user.id+"/"+String(id));
        ref.remove($scope.getMyStuff);
    };
    
    $scope.render = function (text) {
        if (text !== undefined) {
            return $sce.trustAsHtml(text);
        }
    };
});

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

angular.module('html-templates', ['content/add.tpl.html', 'content/artists.tpl.html', 'content/mystuff.tpl.html', 'content/toptracks.tpl.html', 'content/userpage.tpl.html', 'main/footer.tpl.html', 'main/header.tpl.html', 'main/landing.tpl.html', 'validation/login.tpl.html', 'validation/signup.tpl.html']);

angular.module("content/add.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("content/add.tpl.html",
    "<form name=\"addForm\" ng-controller=\"AddCtrl\">\n" +
    "	<fieldset>\n" +
    "		<legend>Add...</legend>\n" +
    "        \n" +
    "        <div class=\"content_type\">\n" +
    "            <button ng-click=\"changeType('track')\">Track</button>\n" +
    "            <button ng-click=\"changeType('video')\">Video</button>\n" +
    "        </div>\n" +
    "        \n" +
    "		<div ng-show=\"isVideo\">\n" +
    "            <h4>Video</h4>\n" +
    "            \n" +
    "            <label>Title</label><input type=\"text\" ng-model=\"video.title\" placeholder=\"Title of Video\" />\n" +
    "            \n" +
    "            <label>Vimeo</label><input type=\"radio\" name=\"videoType\" ng-model=\"video.type\" value=\"vimeo\" />\n" +
    "            <label>YouTube</label><input type=\"radio\" name=\"videotype\" ng-model=\"video.type\" value=\"youtube\" />\n" +
    "            \n" +
    "            <label>url</label><input type=\"text\" ng-model=\"video.url\" placeholder=\"URL Link\" />\n" +
    "            <label for=\"genre\">Genre</label><select ng-model=\"video.genre\" ng-options=\"g.name for g in genres\">\n" +
    "                <option value=\"\"> -- choose -- </option>\n" +
    "            </select>\n" +
    "            \n" +
    "            <button ng-click=\"addVideo(video)\">Add Video</button>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div ng-show=\"isTrack\">\n" +
    "            <h4>Track</h4>\n" +
    "            \n" +
    "            <label>Title</label><input type=\"text\" ng-model=\"track.title\" placeholder=\"Title of Track\" />\n" +
    "            <label for=\"genre\">Genre</label><select ng-model=\"track.genre\" ng-options=\"g.name for g in genres\">\n" +
    "                <option value=\"\"> -- choose -- </option>\n" +
    "            </select>\n" +
    "            \n" +
    "            <button ng-click=\"record()\">Record</button>\n" +
    "            <button ng-click=\"stop()\">Stop</button>\n" +
    "            \n" +
    "            <ul id=\"audioPlayback\">\n" +
    "                <li ng-click=\"play()\">Play</li>\n" +
    "                <li>Time: {{time}}</li>\n" +
    "                <li ng-click=\"add(track)\">Upload</li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "	</fieldset>	\n" +
    "</form>");
}]);

angular.module("content/artists.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("content/artists.tpl.html",
    "<section ng-controller=\"ArtistsCtrl\">\n" +
    "\n" +
    "    <div class=\"search_bar\">\n" +
    "        <input type=\"text\" name=\"search\" id=\"search\" placeholder=\"Search for any artist...\" ng-model=\"artistName\" />\n" +
    "        <button ng-click=\"searchArtist()\">Search</button>\n" +
    "    </div>\n" +
    "        \n" +
    "    <div ng-repeat=\"this in content\">\n" +
    "        <p>{{this.title}}</p>\n" +
    "        <p>{{this.genre}}</p>\n" +
    "        \n" +
    "        <div ng-bind-html=\"render(this.embed)\"></div>\n" +
    "        \n" +
    "        <div ng-show=\"this.commentsEnabled\">\n" +
    "            <button ng-click=\"showComments(this.id)\">Show Comments</button>\n" +
    "            \n" +
    "            <div ng-show=\"user.username\">\n" +
    "                <textarea ng-model=\"comment\" placeholder=\"add your comment...\"></textarea>\n" +
    "                <button ng-click=\"addComment(comment, this.id)\">Add Comment</button>\n" +
    "            </div>\n" +
    "            \n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"comment in comments\">{{this.comment}}</li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    \n" +
    "</section>");
}]);

angular.module("content/mystuff.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("content/mystuff.tpl.html",
    "<h4>Your Stuff</h4>\n" +
    "\n" +
    "<!--\n" +
    "<ul id=\"widgets\">\n" +
    "\n" +
    "</ul>\n" +
    "-->\n" +
    "\n" +
    "<div ng-repeat=\"this in content\">\n" +
    "    <p>{{this.title}}</p>\n" +
    "    <p>{{this.genre}}</p>\n" +
    "    \n" +
    "    <div ng-bind-html=\"render(this.embed)\"></div>\n" +
    "    \n" +
    "    <a href=\"\" ng-click=\"remove(this.id)\">remove</a>\n" +
    "</div>");
}]);

angular.module("content/toptracks.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("content/toptracks.tpl.html",
    "<section ng-controller=\"TopTracksCtrl\" id=\"topTracks\">\n" +
    "    \n" +
    "</section>");
}]);

angular.module("content/userpage.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("content/userpage.tpl.html",
    "<h2>This is the user page.</h2>\n" +
    "\n" +
    "<section ng-controller=\"UserPageCtrl\" class=\"user_section\">\n" +
    "    <h3>Your Content</h3>\n" +
    "    \n" +
    "    <ul class=\"clearfix\">\n" +
    "        <li><a href=\"\" ng-click=\"getMyStuff()\">My Stuff</a></li>\n" +
    "        <li class=\"push_right\"><a href=\"\" ng-click=\"template = 'content/add.tpl.html'\">Add</a></li>\n" +
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
    "<nav>\n" +
    "    <ul>\n" +
    "        <li><a href=\"artists\">Artists</a></li>\n" +
    "        <li><a href=\"toptracks\">Top Tracks</a></li>\n" +
    "        <li ng-show=\"!user\"><a href=\"login\">Log In</a></li>\n" +
    "        <li ng-show=\"!user\"><a href=\"signup\">Sign Up</a></li>\n" +
    "		<li ng-show=\"user\"><a href=\"user\" ng-bind=\"user.username\"></a></li>\n" +
    "		<li ng-show=\"user\"><a href=\"\" ng-click=\"logOut()\">Log Out</a></li>\n" +
    "    </ul>\n" +
    "</nav>");
}]);

angular.module("main/landing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("main/landing.tpl.html",
    "<h2>Avalon is up and running!</h2>");
}]);

angular.module("validation/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("validation/login.tpl.html",
    "<form name=\"logInForm\" ng-controller=\"LogInCtrl\" class=\"clearfix\">\n" +
    "	<fieldset>\n" +
    "		<legend>Login to Avalon&#58;</legend>\n" +
    "		<label for=\"username\">Username</label><input type=\"text\" name=\"username\" id=\"username\" placeholder=\"username or email\" ng-model=\"user.username\" autofocus required />\n" +
    "		<label for=\"password\">Password</label><input type=\"password\" name=\"password\" id=\"password\" required ng-model=\"user.password\" />\n" +
    "	</fieldset>\n" +
    "	\n" +
    "	<div class=\"authentication_cta\">\n" +
    "		<a href=\"index.html\" title=\"Return to Home Page\">cancel</a>\n" +
    "		<button type=\"submit\" ng-click=\"submit(user)\">Log In</button>\n" +
    "	</div>\n" +
    "</form>");
}]);

angular.module("validation/signup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("validation/signup.tpl.html",
    "<form name=\"signUpForm\" ng-controller=\"SignUpCtrl\" class=\"clearfix\">\n" +
    "	<fieldset>\n" +
    "		<legend>Sign Up to Avalon</legend>\n" +
    "		<label for=\"firstName\">First Name</label><input type=\"text\" name=\"firstName\" id=\"firstName\" placeholder=\"John\" ng-model=\"user.firstName\" autofocus required />\n" +
    "		<label for=\"lastName\">Last Name</label><input type=\"text\" name=\"lastName\" id=\"lastName\" placeholder=\"Doe\" ng-model=\"user.lastName\" required />\n" +
    "		<label for=\"email\">Email</label><input type=\"email\" name=\"email\" id=\"email\" placeholder=\"johndoe@service.com\" ng-model=\"user.email\" required />\n" +
    "		<label for=\"username\">Username</label><input type=\"text\" name=\"username\" id=\"username\" placeholder=\"johndoe365\" ng-model=\"user.username\" ng-minLength=\"4\" required />\n" +
    "		<label for=\"password\">Password</label><input type=\"password\" name=\"password\" id=\"password\" ng-model=\"user.password\" ng-minLength=\"8\" ng-pattern=\"/^.*(?=.*\\d)(?=.*[a-zA-Z]).*$/\" required />\n" +
    "		<label for=\"confirmPassword\">Confirm Password</label><input type=\"password\" name=\"confirmPassword\" id=\"confirmPassword\" ng-model=\"user.confirmPassword\" required />\n" +
    "	</fieldset>\n" +
    "	\n" +
    "	<p class=\"toa_and_privacy\">By clicking the submit button you agree to our <a href=\"#\">Terms of Service</a> &amp; <a href=\"#\">Privacy Policies</a>.</p>\n" +
    "	\n" +
    "    <div class=\"authentication_cta\">\n" +
    "		<a href=\"index.html\" title=\"Return to Home Page\">cancel</a>\n" +
    "		<button type=\"submit\" ng-click=\"submit(user)\">Submit</button>\n" +
    "	</div>\n" +
    "</form>");
}]);
