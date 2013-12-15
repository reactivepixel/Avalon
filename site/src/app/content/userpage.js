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
                for (var i = 0, max = tracks.length; i < max; i++) {
                    SC.oEmbed(tracks[i].permalink_url, document.getElementById('widgets'));
                }
            });
        });            
    };
    
    $scope.myTracks = [];
    
    $scope.template = "";
    
}
