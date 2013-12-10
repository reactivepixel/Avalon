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
