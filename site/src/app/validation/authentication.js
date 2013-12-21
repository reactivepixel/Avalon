angular.module("authentication", [])

.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when("/login", {
        templateUrl: "validation/login_form.tpl.html"
    })
    .when("/signup", {
        templateUrl: "validation/signup_form.tpl.html"
    });
})

.controller("AuthenticationCtrl", function ($scope) {
    
    $scope.formTemplate = "validation/signup_form.tpl.html";
    
    $scope.changeToLogIn = function () {
        console.log("change to log in");
    };
    
});
