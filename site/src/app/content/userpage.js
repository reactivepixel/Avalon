function UserPageCtrl($scope, $rootScope, $firebase, FBURL) {
    
    $scope.stuff = [];
    
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
            var data = snapshot.val();
//            $scope.$apply(function () {
//                $scope.contents.push({
//                    title: data.title,
//                    type: data.type,
//                    url: data.url,
//                    genre: data.genre,
//                    src: data.src
//                });    
//            });
            
            var widgets = document.getElementById("widgets");
//            widgets.innerHTML += data.src;
            
            if (data.type === "youtube") {
                widgets.innerHTML += "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
            } else if (data.type === "track") {
//                SC.get("/me/tracks", function (tracks) {
//                    $scope.$apply(function () {
//                        for (var i = 0, max = tracks.length; i < max; i++) {
//                            SC.oEmbed(tracks[i].permalink_url, document.getElementById('widgets'));
//                        }
//                    });
//                });  
                
            } else if (data.type === "vimeo") {
                console.log("We also have a vimeo video");
//                <iframe src="//player.vimeo.com/video/17483947" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="http://vimeo.com/17483947">Flyin' High - Trance Music Fractal Soundscapes</a> from <a href="http://vimeo.com/user5397940">Alex Smith</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
            } 
        });
    };
    
    $scope.myTracks = [];
    $scope.contents = [];
    
    $scope.template = "";
    
    
}
