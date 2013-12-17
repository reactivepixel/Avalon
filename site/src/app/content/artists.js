function ArtistsCtrl($scope, FBURL, $sce) {
    
    $scope.content = [];
    
    $scope.searchArtist = function () {
        $scope.content = [];
        searchUser($scope.artistName);
    };
    
    function searchUser(user) {
        new Firebase(FBURL+"users/")
            .once("value", function (snapshot) {
                var id = snapshot.forEach(function (child) {
                    if (child.val().username === user) {
                        return child.name();
                    }
                });
                getData(id);
            });
    }
    
    function getData(id) {
        new Firebase(FBURL+"content/"+id)
            .once("value", function (snapshot) {
                snapshot.forEach(function (child) {
    
                    var data = child.val();
                    
                    if (data.type === "youtube" || data.type === "vimeo") {
                        $scope.$apply(function () {
                            if (data.type === "youtube") {
                                data.embed = "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
                            } else if (data.type === "vimeo") {
                                data.embed = "<iframe src='//player.vimeo.com/video/"+data.url+"' width='640' height='360' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
                            } 
                            $scope.content.push(data);
                        });
                    }
                    
                    if (data.type === "track") {
                        SC.oEmbed(data.url, { auto_play: false }, function(oEmbed) {
                            $scope.$apply(function () {
                                data.embed = oEmbed.html;
                                $scope.content.push(data);
                            });
                        });
                    }
                });
            });
    }
    
    $scope.render = function (text) {
        if (text !== undefined) {
            return $sce.trustAsHtml(text);
        }
    };
}