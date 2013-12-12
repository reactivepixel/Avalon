angular.module("landing", [])

.config(function () {
	
})

.controller("LandingCtrl", function ($scope) {

	SC.get("/tracks", {genres: 'trance'}, function (tracks) {
		var len = tracks.length,
			max = (len > 10) ? 10 : len,
			i = 0,
			items = [];
		
		for (i = 0 ; i < max; i++) {
			items[i] = tracks[i];
		}
		
		$scope.$apply(function () {
			$scope.items = items;
		});
	});
	
});
