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
