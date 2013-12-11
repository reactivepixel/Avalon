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
