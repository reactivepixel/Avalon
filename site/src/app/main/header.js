function HeaderCtrl ($scope, $rootScope, $location, $firebase, FBURL, User) {
	
	$rootScope.$on("$firebaseAuth:login", function(e, user) {
		User.get();
		$scope.data = User.data;
	});
	
	$scope.logOut = function () {
		if ($rootScope.auth) {
			$scope.data.username = "";
			$scope.data.isUser = false;
			$rootScope.auth.$logout();
			$location.path("/");
		}
	};
	
	$scope.redirectHome = function () {
		$location.path("/");	
	};

}
