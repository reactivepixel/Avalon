angular.module("userPage", ["ngSanitize"])

.controller("UserPageCtrl" ,function UserPageCtrl($scope, $rootScope, $firebase, FBURL, $sce) {
    
    $scope.displayForm = false;
    $scope.contents = [];
    
//    $scope.template = "";
//    $scope.content = [];
   
//    $scope.linkSC = function () {
//        SC.connect(function () {
//            SC.get("/me", function(me) {
//                $rootScope.userSC = me;
//            });
//        });
//    };
    
//    $scope.getMyStuff = function () {
//        $scope.template = "content/mystuff.tpl.html"; 
//        $scope.content = [];
//        
//        var content = new Firebase(FBURL + "content/" + $rootScope.auth.user.id);
//        
//        content.on('child_added', function(snapshot) {
//            var data = snapshot.val();
//            data.id = snapshot.name();
//            
//            if (data.type === "youtube" || data.type === "vimeo") {
//                $scope.$apply(function () {
//                    if (data.type === "youtube") {
//                        data.embed = "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
//                    } else if (data.type === "vimeo") {
//                        data.embed = "<iframe src='//player.vimeo.com/video/"+data.url+"' width='640' height='360' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
//                    } 
//                    $scope.content.push(data);
//                });
//            }
//            
//            if (data.type === "track") {
//                SC.oEmbed(data.url, { auto_play: false }, function(oEmbed) {
//                    $scope.$apply(function () {
//                        data.embed = oEmbed.html;
//                        $scope.content.push(data);
//                    });
//                });
//            }
//        });
//    };
//    
//    $scope.remove = function (id) {
//        var ref = new Firebase(FBURL+"content/"+$rootScope.auth.user.id+"/"+String(id));
//        ref.remove($scope.getMyStuff);
//    };
//    
//    $scope.render = function (text) {
//        if (text !== undefined) {
//            return $sce.trustAsHtml(text);
//        }
//    };
});
