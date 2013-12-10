angular.module("userData", [])
	.factory("User", function (FBURL, Firebase) {
		return {
			data: {
				username: "",
				isUser: false
			},
			get: function () {
				var id = "11",
					url = FBURL + "users/" + id,
					fb = new Firebase(url),
					ref = this.data;
				
				fb.on("value", function (snapshot) {
					ref.username = snapshot.val().username;
					ref.isUser = true;
				});
			}	
		};
	});