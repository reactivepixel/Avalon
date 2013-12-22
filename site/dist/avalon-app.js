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
    
//    function getTime(ms) {
//        $scope.time = SC.Helper.millisecondsToHMS(ms);
//    }
    
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
function ExploreCtrl ($scope, FBURL, $sce, $rootScope) {

    $scope.contents = [];
    
    $scope.search = function (query) {
        $scope.contents = [];
        searchUser(query);
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
    
                    if (data.type === "youtube") {
                        data.embed = "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
                    } else if (data.type === "vimeo") {
                        data.embed = "<iframe src='//player.vimeo.com/video/"+data.url+"' width='640' height='360' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
                    }
                    
                    $scope.$apply(function () {
                        $scope.contents.push(data);
                    });
                });
            });
    }
    
    $scope.render = function (element) {
        if (element !== undefined) {
            return $sce.trustAsHtml(element);
        }
    };

}
function SoundCloudCtrl ($scope) {
    
//    $scope.isRecording = false;
//    $scope.hasRecorded = false;
//    $scope.time = "0:00";
//    
//    $scope.linkSC = function (username) {
//        
//    };
//    
//    $scope.record = function () {
//        $scope.isRecording = true;
//        $scope.hasRecorded = true;
//    };
//    
//    $scope.stop = function () {
//        $scope.isRecording = false;
//    };
    
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
    
    $scope.displayForm = false;
    $scope.contents = [];
    
    $scope.addVideo = function (video) {
    
        if ($scope.isRecording) {
            alert("You are still recording!");
            return false;
        }
        
        if (video) {
            if (!video.type) {
                alert("Please select a type.");
                return null;
            } else if (!video.link) {
                alert("Please specify a link.");
                return null;
            }
            
            var fb = new Firebase(FBURL + "content/" + $rootScope.auth.user.id),
                newVideo = {
                    type:  video.type,
                    url:   video.link
                };
            fb.push(newVideo);
            $scope.video = null;
            $scope.hasRecorded = false;
            $scope.isRecording = false;
            $scope.displayForm = false;
        }
    };
    
    
    
    $scope.isRecording = false;
    $scope.hasRecorded = false;
    $scope.time = "0:00";
    
    $scope.addTrack = function (track) {
    
    };
    

    
    $scope.record = function () {
        $scope.isRecording = true;
        $scope.hasRecorded = true;
        
        SC.record({
            progress: function(ms, avgPeak) {
                updateTimer(ms);
            }
        });
    };
    
    $scope.stop = function () {
//        console.log("stop");
        $scope.isRecording = false;
        SC.recordStop();
    };
    
    $scope.addTrack = function (audio) {
        
        if (!audio.title) {
            alert("Please add a title to the track.");
            return null;
        } 
        
//        console.log(track.title);
    
        SC.connect({
            connected: function () {
//                console.log("Uploading...");
                console.log(audio.title);
                
                SC.recordUpload({
                    track: {
                        title: audio.title,
                        genre: "Avalon",
                        sharing: "public"
                    }
                }, function (audio, err) {
                    console.log("Uploaded: " + audio.permalink_url);
                    
                    var fb = new Firebase(FBURL + "content/" + $rootScope.auth.user.id),
                        newTrack = {
                            title: audio.title,
                            url: audio.permalink_url,
                            type: "soundcloud"
                        };
                    
                    fb.push(newTrack);
                });
            }
        });
    };
    
    $scope.play = function () {
        console.log("playing");
        
        updateTimer(0);
        SC.recordPlay({
            progress: function(ms) {
                updateTimer(ms);
            }
        });
    };
    
    function updateTimer(ms) {
        $scope.$apply(function () {
            $scope.time = SC.Helper.millisecondsToHMS(ms);   
        });
    }
    
    function showContent() {
        $scope.contents = [];
        
        if (!$rootScope.auth.user) {
            return null;
        }
        
        var content = new Firebase(FBURL + "content/" + $rootScope.auth.user.id);
        content.on("child_added", function (snapshot) {
            var data = snapshot.val();
            
            if (data.type === "youtube") {
                data.embed = "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
            } else if (data.type === "vimeo") {
                data.embed = "<iframe src='//player.vimeo.com/video/"+data.url+"' width='640' height='360' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
            }
            
            $scope.$apply(function () {
                $scope.contents.push(data);
            });
        });
    };
    
    showContent();
    
    $scope.render = function (element) {
        if (element) {
            return $sce.trustAsHtml(element);
        }
    };
          
//            if (data.type === "track") {
//                SC.oEmbed(data.url, { auto_play: false }, function(oEmbed) {
//                    $scope.$apply(function () {
//                        data.embed = oEmbed.html;
//                        $scope.content.push(data);
//                    });
//                });
//            }
//        });
//    };
});

function VideoCtrl ($scope) {
    
    
    
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
    "landing",
    "userPage",
    "authentication"
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
//	
//    $scope.formTemplate = "validation/signup_form.tpl.html";
//    
//    $scope.changeToLogIn = function () {
//        $scope.formTemplate = "validation/login_form.tpl.html";
//    };
//    
//    $scope.changeToSignUp = function () {
//        $scope.formTemplate = "validation/signup_form.tpl.html";
//    };  
//    
});

angular.module("authentication", [])

.controller("AuthenticationCtrl", function ($scope, $rootScope, User, FBURL) {
    
    $scope.formTemplate = "validation/signup_form.tpl.html";
    
    $scope.changeToLogIn = function () {
        $scope.formTemplate = "validation/login_form.tpl.html";
        clean();
    };
    
    $scope.changeToSignUp = function () {
        $scope.formTemplate = "validation/signup_form.tpl.html";
        clean();
    };
    
    $scope.login = function (form) {
        
        if (form) {
            if (form.email === undefined || form.email === "") {
                alert("Invalid email.");
                return null;
            } else if (form.password === undefined || form.password === "") {
                alert("Invalid password.");
                return null;
            }
            
            $rootScope.auth.$login("password", {
                email: form.email,
                password: form.password
            });
        } else {
            alert("Please fill out form.");
            return null;
        }
        
    };
    
    $scope.signup = function (form) {
        
        if (form) {
            if (form.fullName === undefined || form.fullName === "") { 
                alert("Invalid full name.");
                return null;
            } else if (form.email === undefined || form.email === "") {
                alert("Invalid email.");
                return null;
            } else if (form.password === undefined || form.password === "") {
                alert("Invalid password.");
                return null;
            }
            
            $rootScope.auth.$createUser(form.email, form.password, 
				function (error, newUser) {
					if (!error) {
                        User.getSingle(newUser.id);
						createProfile(form, newUser.id);
					} else {
                        alert(error.code);
                    }
				});
        } else {
            alert("Please fill out form.");
            return null;
        }
        
    };
    
    function clean() {
        $scope.form = null;
    }
    
	function createProfile(user, id) {
		var info = {
				username: user.fullName
			};
		
		new Firebase(FBURL).child("users/"+id).set(info, function (err) {
			if (!err) {
				
			}
		});
	}
    
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
	
    $scope.signup = function (form) {
        
    }
    
//	$scope.submit = function (user) {
//		if ($scope.signUpForm.$valid) {
//			var match = checkPasswordMatch(user.password, user.confirmPassword);
//		
//			if (!match) {
//				window.alert("Passwords must match.");
//				resetPasswords();
//				return false;
//			} else {
//				console.log("Valid");
//				$rootScope.auth.$createUser(user.email, user.password, 
//				function (error, newUser) {
//					if (!error) {
//						console.log("User ID: " + newUser.id);
//						createProfile(user, newUser.id);
//					}
//				});
//				return true;
//			}
//		} else {
//			window.alert("Form is not valid");
//			resetPasswords();
//			return false;
//		}
//	};
//	
//	function checkPasswordMatch(p1, p2) {
//		return p1 === p2;
//	}
//	
//	function resetPasswords() {
//		if ($scope.user !== undefined) {
//			$scope.user.password = null;
//			$scope.user.confirmPassword = null;
//		}
//	}
//	

	
}

angular.module('html-templates', ['content/add.tpl.html', 'content/artists.tpl.html', 'content/explore.tpl.html', 'content/mystuff.tpl.html', 'content/toptracks.tpl.html', 'content/userpage.tpl.html', 'main/header.tpl.html', 'main/landing.tpl.html', 'validation/login.tpl.html', 'validation/login_form.tpl.html', 'validation/signup.tpl.html', 'validation/signup_form.tpl.html']);

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

angular.module("content/explore.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("content/explore.tpl.html",
    "<section class=\"explore_section\" ng-controller=\"ExploreCtrl\">\n" +
    "    \n" +
    "    <div class=\"margin_center\">\n" +
    "        <form>\n" +
    "            <input type=\"text\" name=\"search\" placeholder=\"Explore any artist...\" ng-model=\"form.query\" required />\n" +
    "            <button ng-click=\"search(form.query)\">Search</button>\n" +
    "        </form>\n" +
    "        \n" +
    "        <ul class=\"content_list\">\n" +
    "            <li ng-repeat=\"this in contents\">\n" +
    "                 <div ng-bind-html=\"render(this.embed)\"></div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
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
    "<section ng-controller=\"UserPageCtrl\" class=\"user_section\">\n" +
    "    \n" +
    "    <div class=\"margin_center\">\n" +
    "        <h2>Page of {{user.username}}</h2>\n" +
    "        \n" +
    "        <button ng-show=\"!displayForm\" ng-click=\"displayForm = true\">Add New...</button>\n" +
    "        <button ng-show=\"displayForm\" ng-click=\"displayForm = false\">Hide Forms</button>\n" +
    "        <form ng-controller=\"VideoCtrl\" ng-show=\"displayForm\" class=\"clearfix video_uploader\">\n" +
    "            <h3>Add a video...</h3>\n" +
    "            \n" +
    "            <div class=\"radio_buttons\">\n" +
    "                <label>Vimeo</label><input type=\"radio\" name=\"type\" ng-model=\"video.type\" value=\"vimeo\" />\n" +
    "                <label>YouTube</label><input type=\"radio\" name=\"type\" ng-model=\"video.type\" value=\"youtube\" />\n" +
    "            </div>\n" +
    "            \n" +
    "            <fieldset ng-show=\"video.type === 'vimeo'\" class=\"clearfix\">\n" +
    "                <legend>To add video just press the share link and complete the entire link.</legend>\n" +
    "                <label>http://vimeo.com/</label><input type=\"text\" ng-model=\"video.link\" />\n" +
    "                \n" +
    "                <button ng-click=\"addVideo(video)\">Add Vimeo Video</button>\n" +
    "            </fieldset>\n" +
    "            \n" +
    "            <fieldset ng-show=\"video.type === 'youtube'\" class=\"clearfix\">\n" +
    "                <legend>To add video just press the share link and complete the entire link.</legend>\n" +
    "                <label>http://youtu.be/</label><input type=\"text\" ng-model=\"video.link\" />\n" +
    "                \n" +
    "                <button ng-click=\"addVideo(video)\">Add YouTube Video</button>\n" +
    "            </fieldset>\n" +
    "        </form>\n" +
    "        \n" +
    "<!--\n" +
    "        <form ng-show=\"displayForm\" ng-controller=\"SoundCloudCtrl\" class=\"clearfix\">\n" +
    "            \n" +
    "            <div class=\"clearfix\">\n" +
    "                <h3>Add a track...</h3>\n" +
    "                <button class=\"special_button\" ng-show=\"!isRecording\" ng-click=\"record()\">Record</button>\n" +
    "                <button class=\"special_button\" ng-show=\"isRecording\" ng-click=\"stop()\">Stop</button>\n" +
    "            </div>\n" +
    "            \n" +
    "            <input class=\"track_name\" type=\"text\" ng-model=\"track.title\" placeholder=\"Track Name\" />\n" +
    "            \n" +
    "            <ul class=\"audio_player\" ng-show=\"hasRecorded\" class=\"clearfix\">\n" +
    "                <li class=\"timer\">Time: {{time}}</li>\n" +
    "                <li ng-click=\"play()\"><button>Play</button></li>\n" +
    "                <li ng-click=\"addTrack(track)\"><button>Upload</button></li>\n" +
    "            </ul>\n" +
    "        </form>\n" +
    "-->\n" +
    "        \n" +
    "        <ul class=\"content_list\">\n" +
    "            <li ng-repeat=\"this in contents\">\n" +
    "                 <div ng-bind-html=\"render(this.embed)\"></div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        \n" +
    "    </div>\n" +
    "    \n" +
    "</section>");
}]);

angular.module("main/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("main/header.tpl.html",
    "<div class=\"margin_center\">\n" +
    "    <h1><a href=\"\" ng-click=\"redirectHome()\">Avalon</a></h1>\n" +
    "    \n" +
    "    <nav>\n" +
    "        <ul class=\"clearfix\">\n" +
    "            <li><a href=\"#/explore\">Explore</a></li>\n" +
    "            <li ng-show=\"user\"><a href=\"#/user\">My Stuff</a></li>\n" +
    "            <li ng-show=\"user\"><a href=\"\" ng-click=\"logOut()\"><strong>logout</strong></a></li>\n" +
    "        </ul>\n" +
    "    </nav>\n" +
    "</div>");
}]);

angular.module("main/landing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("main/landing.tpl.html",
    "<section>\n" +
    "    \n" +
    "    <div class=\"clearfix landing_section\">\n" +
    "        <div class=\"margin_center\">\n" +
    "            <h2>Welcome! {{user.username}}</h2>\n" +
    "            <hr>\n" +
    "            \n" +
    "            <div class=\"left_column\">\n" +
    "                <ul>\n" +
    "                    <li ng-show=\"user\">{{user.username}}, why not add something new today? <a class=\"push_right\" href=\"#/user\">Upload Now</a></li>\n" +
    "                </ul>\n" +
    "                \n" +
    "                <div ng-show=\"!user\">\n" +
    "                    <h3>Newest Features:</h3>\n" +
    "                    <ul>\n" +
    "                        <li>Search for any kind of content in Avalon with the <a href=\"#/explore\">explore</a> feature.</li>\n" +
    "                        <li>Link audio from SoundCloud.</li>\n" +
    "                        <li>Link any video from YouTube or Vimeo.</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <form ng-controller=\"AuthenticationCtrl\" class=\"clearfix\" ng-show=\"!user\" ng-include=\"formTemplate\"></form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "            \n" +
    "    <article class=\"example_section\">\n" +
    "        <div class=\"margin_center\">\n" +
    "            <div class=\"left_column\">\n" +
    "                <h2>What is Avalon?</h2>\n" +
    "                <hr>\n" +
    "                \n" +
    "                <p>Avalon is where artists of all kinds promote their creative work easily and effectively with other artists. We believe that you should be able to easily find the work of other like minded artists easily. If you doubt our service, please try and explore for content in Avalon and see how easy it is to find art.</p>\n" +
    "            \n" +
    "                <p>Even services as disparate as YouTube and SoundCloud work together in unison to provide the best experience. Don't fear mixing your video content with audio content.</p>\n" +
    "            </div>\n" +
    "            \n" +
    "            <img src=\"assets/services.png\" />\n" +
    "        </div>\n" +
    "    </article>\n" +
    "            \n" +
    "</section>");
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

angular.module("validation/login_form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("validation/login_form.tpl.html",
    "<fieldset>\n" +
    "    <legend>Log in to Avalon</legend>\n" +
    "    <input type=\"email\" name=\"email\" placeholder=\"Email\" ng-model=\"form.email\" required />\n" +
    "    <input type=\"password\" name=\"password\" placeholder=\"Password\" ng-model=\"form.password\" required />\n" +
    "    <a href=\"\" ng-click=\"changeToSignUp()\">not a member? Sign Up</a>\n" +
    "    <button ng-click=\"login(form)\">Log In</button>\n" +
    "</fieldset>");
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

angular.module("validation/signup_form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("validation/signup_form.tpl.html",
    "<fieldset>\n" +
    "    <legend>New to Avalon? Sign Up Here!</legend>\n" +
    "    <input type=\"text\" name=\"fullName\" placeholder=\"Full Name\" ng-model=\"form.fullName\" required />\n" +
    "    <input type=\"email\" name=\"email\" placeholder=\"Email\" ng-model=\"form.email\" required />\n" +
    "    <input type=\"password\" name=\"password\" placeholder=\"Password\" ng-model=\"form.password\" required />\n" +
    "    <a href=\"\" ng-click=\"changeToLogIn()\">not new? Log In</a>\n" +
    "    <button ng-click=\"signup(form)\">Sign Up</button>\n" +
    "</fieldset>");
}]);
