function LogInCtrl ($scope, $location, $rootScope, $firebase, $firebaseAuth, FBURL) {
	
	if ($rootScope.auth.user) {
		$rootScope.auth.$logout();
	}
	
	$rootScope.$on("$firebaseAuth:login", function(e, user) {
	    console.log("User " + user.id + " successfully logged in!");
		$location.path("/home");
	});
	
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
	
	$scope.logout = function (user) {
		$rootScope.auth.$logout();
		$location.path("index.html");
	};
	
}