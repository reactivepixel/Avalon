angular.module("userPage", ["ngSanitize"])

.controller("UserPageCtrl" ,function UserPageCtrl($scope, $rootScope, $firebase, FBURL, $sce) {
    
    $scope.displayForm = false;
    $scope.contents = [];
    
    $scope.addVideo = function (video) {
    
        if ($scope.isRecording) {
            alert("You are still recording!");
            return false;
        }
        
        if (video) {
            if (!video.type) {
                alert("Please select a type.");
                return null;
            } else if (!video.link) {
                alert("Please specify a link.");
                return null;
            }
            
            var fb = new Firebase(FBURL + "content/" + $rootScope.auth.user.id),
                newVideo = {
                    type:  video.type,
                    url:   video.link
                };
            fb.push(newVideo);
            $scope.video = null;
            $scope.hasRecorded = false;
            $scope.isRecording = false;
            $scope.displayForm = false;
        }
    };
    
    
    
    $scope.isRecording = false;
    $scope.hasRecorded = false;
    $scope.time = "0:00";
    
    $scope.addTrack = function (track) {
    
    };
    

    
    $scope.record = function () {
        $scope.isRecording = true;
        $scope.hasRecorded = true;
        
        SC.record({
            progress: function(ms, avgPeak) {
                updateTimer(ms);
            }
        });
    };
    
    $scope.stop = function () {
//        console.log("stop");
        $scope.isRecording = false;
        SC.recordStop();
    };
    
    $scope.addTrack = function (audio) {
        
        if (!audio.title) {
            alert("Please add a title to the track.");
            return null;
        } 
        
//        console.log(track.title);
    
        SC.connect({
            connected: function () {
//                console.log("Uploading...");
                console.log(audio.title);
                
                SC.recordUpload({
                    track: {
                        title: audio.title,
                        genre: "Avalon",
                        sharing: "public"
                    }
                }, function (audio, err) {
                    console.log("Uploaded: " + audio.permalink_url);
                    
                    var fb = new Firebase(FBURL + "content/" + $rootScope.auth.user.id),
                        newTrack = {
                            title: audio.title,
                            url: audio.permalink_url,
                            type: "soundcloud"
                        };
                    
                    fb.push(newTrack);
                });
            }
        });
    };
    
    $scope.play = function () {
        console.log("playing");
        
        updateTimer(0);
        SC.recordPlay({
            progress: function(ms) {
                updateTimer(ms);
            }
        });
    };
    
    function updateTimer(ms) {
        $scope.$apply(function () {
            $scope.time = SC.Helper.millisecondsToHMS(ms);   
        });
    }
    
    function showContent() {
        $scope.contents = [];
        
        if (!$rootScope.auth.user) {
            return null;
        }
        
        var content = new Firebase(FBURL + "content/" + $rootScope.auth.user.id);
        content.on("child_added", function (snapshot) {
            var data = snapshot.val();
            
            if (data.type === "youtube") {
                data.embed = "<iframe width='640' height='360' src='//www.youtube.com/embed/"+data.url+"?rel=0' frameborder='0' allowfullscreen></iframe>";
            } else if (data.type === "vimeo") {
                data.embed = "<iframe src='//player.vimeo.com/video/"+data.url+"' width='640' height='360' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
            }
            
            $scope.$apply(function () {
                $scope.contents.push(data);
            });
        });
    };
    
    showContent();
    
    $scope.render = function (element) {
        if (element) {
            return $sce.trustAsHtml(element);
        }
    };
          
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
});
