angular.module("authentication", [])

.controller("AuthenticationCtrl", function ($scope, $rootScope, User, FBURL) {
    
    // Initialize page with the sign up form.
    $scope.formTemplate = "validation/signup_form.tpl.html";
    
    // Swap and clean to login form.
    $scope.changeToLogIn = function () {
        $scope.formTemplate = "validation/login_form.tpl.html";
        clean();
    };
    
    // Swap and clean to signup form.
    $scope.changeToSignUp = function () {
        $scope.formTemplate = "validation/signup_form.tpl.html";
        clean();
    };
    
    // Login after validating data into app.
    $scope.login = function (form) {
        
        if (form) {
            if (form.email === undefined || form.email === "") {
                alert("Invalid email.");
                return null;
            } else if (form.password === undefined || form.password === "") {
                alert("Invalid password.");
                return null;
            }
            
            $rootScope.auth.$login("password", {
                email: form.email,
                password: form.password
            });
        } else {
            alert("Please fill out form.");
            return null;
        }
        
    };
    
    // Sign Up into app after validating data.
    $scope.signup = function (form) {
        
        if (form) {
            if (form.fullName === undefined || form.fullName === "") { 
                alert("Invalid full name.");
                return null;
            } else if (form.email === undefined || form.email === "") {
                alert("Invalid email.");
                return null;
            } else if (form.password === undefined || form.password === "") {
                alert("Invalid password.");
                return null;
            }
            
            // Create new user and if successful, get user data as user will get logged in.
            $rootScope.auth.$createUser(form.email, form.password, 
				function (error, newUser) {
					if (!error) {
                        User.getSingle(newUser.id);
						createProfile(form, newUser.id);
					} else {
                        alert(error.code);
                    }
				});
        } else {
            alert("Please fill out form.");
            return null;
        }
        
    };
    
    // Helper function to empty the form.
    function clean() {
        $scope.form = null;
    }
    
    /*
        createProfile is a function that creates a object inside the database that keeps track
        of basic but fundamental data like the Full Name of the user.
    */
	function createProfile(user, id) {
		var info = {
				username: user.fullName
			};
		
		new Firebase(FBURL).child("users/"+id).set(info, function (err) {
			if (!err) {
				// TODO: make it show what kind of error occurred elegantly.
			}
		});
	}
    
});
