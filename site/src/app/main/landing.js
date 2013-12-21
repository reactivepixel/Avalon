angular.module("landing", [])

.config(function () {
	
})

.controller("LandingCtrl", function ($scope) {
	
    $scope.formTemplate = "validation/signup_form.tpl.html";
    
    $scope.changeToLogIn = function () {
        $scope.formTemplate = "validation/login_form.tpl.html";
    };
    
    $scope.changeToSignUp = function () {
        $scope.formTemplate = "validation/signup_form.tpl.html";
    };  
    
});
