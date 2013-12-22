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
