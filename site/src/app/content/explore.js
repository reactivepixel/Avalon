function ExploreCtrl ($scope, FBURL, $sce, $rootScope) {

    $scope.contents = [];
    
    $scope.search = function (query) {
        $scope.contents = [];
        searchUser(query);
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
    
                    if (data.type === "youtube") {
                        data.embed = "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
                    } else if (data.type === "vimeo") {
                        data.embed = "<iframe src='//player.vimeo.com/video/"+data.url+"' width='640' height='360' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
                    }
                    
                    $scope.$apply(function () {
                        $scope.contents.push(data);
                    });
                });
            });
    }
    
    $scope.render = function (element) {
        if (element !== undefined) {
            return $sce.trustAsHtml(element);
        }
    };

}