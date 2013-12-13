function UserPageCtrl($scope, $rootScope) {
    
    $scope.linkSC = function () {
        SC.connect(function () {
            SC.get("/me", function(me) {
                $rootScope.userSC = me;
            });
        });
    };
    
    $scope.getMyStuff = function () {
        $scope.template = "content/mystuff.tpl.html";
        console.log($rootScope.userSC);
//        SC.get();
    };
    
    $scope.template = "";
    
}
