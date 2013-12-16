function AddCtrl($scope, $rootScope, FBURL) {
    
    $scope.isTrack = false;
    $scope.isVideo = false;
    $scope.genres = [{name: "Trance"}, {name: "Talk"}, {name: "House"}];
    $scope.track = {};
    $scope.time = "0.00";
    $scope.video = {};
    
    $scope.changeType = function (type) {
        if (type === "track") {
            $scope.isTrack = true;
            $scope.isVideo = false;
        } else if (type === "video") {
            $scope.isVideo = true;
            $scope.isTrack = false;
        }
    };
    
    $scope.record = function () {
        console.log("recording");
        SC.record({
            progress: function(ms, avgPeak) {
                getTime(ms);
            }
        });
    };
    
    $scope.stop = function () {
        console.log("stopping");
        SC.recordStop();
    };
    
    $scope.add = function (track) {
        
        if (track.title !== undefined && track.genre !== undefined) {
            console.log("Test Passed");
        } else {
            console.log("Test Failed");
        }
        
        SC.connect({
            connected: function () {
                console.log("Uploading...");
                
                SC.recordUpload({
                    track: {
                        title: track.title,
                        genre: track.genre.name,
                        sharing: "public"
                    }
                }, function (track) {
                    console.log("Uploaded: " + track.permalink_url);
                });
            }
        });
    };
    
    $scope.play = function () {
        console.log("playing");
        
//        updateTimer(0);
        SC.recordPlay({
            progress: function(ms) {
//                updateTimer(ms);
            }
        });
    };
    
    $scope.addVideo = function (video) {        
        if (checkFields(video)) {
            var fb = new Firebase(FBURL + "content/" + $rootScope.auth.user.id),
                newVideo = {
                    title: video.title,
                    genre: video.genre.name,
                    type:  video.type,
                    url:   video.url,
                    username: $rootScope.user.username
                };
            fb.push(newVideo);
        }
    };
        
    function checkFields(video) {
        
        if (video.title !== undefined && video.genre !== undefined && video.type !== undefined && video.url !== undefined) {
            return true;
        }
        
        return false;
    }
    
    function getTime(ms) {
        $scope.time = SC.Helper.millisecondsToHMS(ms);
    }
    
}
