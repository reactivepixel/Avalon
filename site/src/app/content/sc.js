function SoundCloudCtrl ($scope) {
    
    $scope.isRecording = false;
    $scope.hasRecorded = false;
    $scope.time = "0:00";
    
    $scope.linkSC = function (username) {
        
    };
    
    $scope.record = function () {
        $scope.isRecording = true;
        $scope.hasRecorded = true;
    };
    
    $scope.stop = function () {
        $scope.isRecording = false;
    };
    
}