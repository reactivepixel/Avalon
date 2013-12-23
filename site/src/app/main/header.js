function HeaderCtrl ($scope, $rootScope) {
	
    // Log out the user when link gets clicked.
	$scope.logOut = function () {
		if ($rootScope.auth) {
			$rootScope.auth.$logout();
		}
	};
	
}
