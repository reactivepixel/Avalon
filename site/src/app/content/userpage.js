angular.module("userPage", ["ngSanitize"])

.controller("UserPageCtrl" ,function UserPageCtrl($scope, $rootScope, $firebase, FBURL, $sce) {
    
    $scope.stuff = [];
//    $scope.embed = ["<h1>Default</h1>", "<h2>Default Two</h2>"];
//    $scope.embed = "";
    
    $scope.linkSC = function () {
        SC.connect(function () {
            SC.get("/me", function(me) {
                $rootScope.userSC = me;
            });
        });
    };
    
    $scope.getMyStuff = function () {
        $scope.template = "content/mystuff.tpl.html"; 
        
        var content = new Firebase(FBURL + "content/" + $rootScope.auth.user.id);
        
        content.on('child_added', function(snapshot) {
            var data = snapshot.val(),
                id = snapshot.name();
            
//            if (data.type === "youtube") {
//                $scope.embed = "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
//            } else {
//                data.embed = "";
//            }
            
            $scope.$apply(function () {
                
                if (data.type === "youtube") {
//                    data.embed = "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
                } else {
//                    data.embed = "";
                }
                
                $scope.content.push(data);
            });
            
//            var widgets = document.getElementById("widgets");
            
        /*    widgets.innerHTML += "<div>"
            if (data.type === "youtube") {
                widgets.innerHTML += "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
            } else if (data.type === "track") { */
//                SC.get("/me/tracks", function (tracks) {
//                    $scope.$apply(function () {
//                        for (var i = 0, max = tracks.length; i < max; i++) {
//                            SC.oEmbed(tracks[i].permalink_url, document.getElementById('widgets'));
//                        }
//                    });
//                })
            /*    SC.oEmbed(data.url, { auto_play: false }, function(oEmbed) {
                    widgets.innerHTML += oEmbed.html;
                });
            } else if (data.type === "vimeo") {
                widgets.innerHTML += "<iframe src='//player.vimeo.com/video/" + data.url + "' width='500' height='281' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
            } 
            
            if (data.type !== "track") {
                widgets.innerHTML += "<a href='delete/"+snapshot.name()+"'>remove</a>";    
            }
            
            widgets.innerHTML += "</div>";*/
        });
    };
    
    $scope.myTracks = [];
    $scope.content = [];
    
    $scope.template = "";
    
    $scope.remove = function () {
        console.log("removing");
    };
    
    $scope.render = function () {
        
//        div.innerHTML = "<h1>Testing</h1>";
        console.log("ran");
        return $sce.trustAsHtml("<iframe width='640' height='360' src='//www.youtube.com/embed/Y7S8XpJXCq0?rel=0' frameborder='0' allowfullscreen></iframe>");
//        console.log(angular.element("<h1>YouTube</h1>"));
//        if (text !== undefined) {
//            return "<iframe width='640' height='360' src='//www.youtube.com/embed/Y7S8XpJXCq0?rel=0' frameborder='0' allowfullscreen></iframe>";    
//        return "<span>Testing</span";
//        }
    };
});
