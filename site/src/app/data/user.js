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
