function ExploreCtrl ($scope, FBURL, $sce, $rootScope) {
    
    // Collection for all the selected content.
    $scope.contents = [];
    
    // Make a query for all the content of the requested user.
    $scope.search = function (query) {
        $scope.contents = [];   // reset the collection for new view of items
        searchUser(query);
    };
    
    // Make a query to check if the user exists in our database.
    function searchUser(user) {
        new Firebase(FBURL+"users/")
            .once("value", function (snapshot) {
                var id = snapshot.forEach(function (child) {
                    if (child.val().username === user) {
                        return child.name();    // The name we are extracting is the id of the user.
                    }
                });
                
                // Use this function as a hardcoded callback.
                getData(id);
            });
    }
    
    // Just grab all the data the user has stored.
    function getData(id) {
        new Firebase(FBURL+"content/"+id)
            .once("value", function (snapshot) {
                snapshot.forEach(function (child) {
                    
                    var data = child.val();
                    
                    // Deal the different types of embeds accordingly.
                    if (data.type === "youtube") {
                        data.embed = "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
                    } else if (data.type === "vimeo") {
                        data.embed = "<iframe src='//player.vimeo.com/video/"+data.url+"' width='640' height='360' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
                    }
                    
                    // Update the collection.
                    $scope.$apply(function () {
                        $scope.contents.push(data);
                    });
                });
            });
    }
    
    // Helper function that makes it possible to render iframes in angular.
    $scope.render = function (element) {
        if (element !== undefined) {
            return $sce.trustAsHtml(element);
        }
    };

}