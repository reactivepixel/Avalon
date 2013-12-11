angular.module("userData", [])
	.factory("User", function (FBURL, Firebase, $rootScope) {
		return {
			getSingle: function (userId) {				
				var fb = new Firebase(FBURL + "users/" + userId);
				fb.on("value", function (snapshot) {
					$rootScope.$apply(function () {
						$rootScope.user = snapshot.val();
					});
				});	
			},
			getCollection: function () {
				
			}
		};
	});
