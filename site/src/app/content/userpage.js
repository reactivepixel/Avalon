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
        SC.get("/me/tracks", function (tracks) {
            $scope.$apply(function () {
                $scope.myTracks = tracks;
            });
        });            
    };
    
    $scope.myTracks = [];
    
    $scope.template = "";
    
}
