function SignUpCtrl ($scope, $location, $rootScope, $firebase, $firebaseAuth, FBURL) {
	
	var url = FBURL;
	
	$rootScope.$on("$firebaseAuth:login", function(e, user) {
	    console.log("User " + user.id + " successfully logged in!");
		$location.path("home");
	});
	
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
//				resetPasswords();
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