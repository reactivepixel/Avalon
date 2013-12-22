angular.module("authentication", [])

.controller("AuthenticationCtrl", function ($scope, $rootScope, User, FBURL) {
    
    $scope.formTemplate = "validation/signup_form.tpl.html";
    
    $scope.changeToLogIn = function () {
        $scope.formTemplate = "validation/login_form.tpl.html";
        clean();
    };
    
    $scope.changeToSignUp = function () {
        $scope.formTemplate = "validation/signup_form.tpl.html";
        clean();
    };
    
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
    
    function clean() {
        $scope.form = null;
    }
    
	function createProfile(user, id) {
		var info = {
				username: user.fullName
			};
		
		new Firebase(FBURL).child("users/"+id).set(info, function (err) {
			if (!err) {
				
			}
		});
	}
    
});
