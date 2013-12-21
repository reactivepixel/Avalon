angular.module("authentication", [])

.controller("AuthenticationCtrl", function ($scope, $rootScope) {
    
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
        
        if (form !== null) {
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
        console.log(form);
    };
    
    function clean() {
        $scope.form = null;
    }
    
});
