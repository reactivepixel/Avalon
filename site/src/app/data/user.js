angular.module("userData", [])
	.factory("User", function (FBURL, Firebase, $rootScope, $firebase) {
		return {
            // Just assign the new user to the rootScope so we can have global access to him.
			getSingle: function (userId) {				
                $rootScope.user = $firebase(new Firebase(FBURL+"users/"+userId));
			}
		};
	});
