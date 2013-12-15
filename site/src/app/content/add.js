function AddCtrl($scope) {
    
    $scope.isTrack = false;
    $scope.isVideo = false;
    $scope.genres = [{name: "Trance"}, {name: "Talk"}, {name: "House"}];
    $scope.track = {};
    
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
        
    };
    
    $scope.stop = function () {
        
    };
    
    
//    $('#startRecording a').click(function(e) {
//      $('#startRecording').hide();
//      $('#stopRecording').show();
//      e.preventDefault();
//      SC.record({
//        progress: function(ms, avgPeak) {
//          updateTimer(ms);
//        }
//      });
//    });
//    
//    $('#stopRecording a').click(function(e) {
//      e.preventDefault();
//      $('#stopRecording').hide();
//      $('#playBack').show();
//      $('#upload').show();
//      SC.recordStop();
//    });
    
//    $('#upload').click(function(e) {
//    e.preventDefault();
//    SC.connect({
//      connected: function() {
//        $('.status').html('Uploading...');
//        SC.recordUpload({
//          track: {
//            title: 'My Codecademy Recording',
//            sharing: 'private'
//          }
//        }, function(track) {
//          $('.status').html("Uploaded: <a href='" + track.permalink_url + "'>" + track.permalink_url + "</a>");
//        });
//      }
//    });
    
}
