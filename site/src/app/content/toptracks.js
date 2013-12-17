function TopTracksCtrl () {
    
    SC.get("/tracks", {limit: 10}, function (tracks) {
        
        var container = document.getElementById("topTracks");
        
        for (var i = 0, max = tracks.length; i < max; i++) {
            SC.oEmbed(tracks[i].permalink_url, {}, function (oEmbed) {
                if (oEmbed !== null) {
                    container.innerHTML += oEmbed.html;
                }
            });
        }
    });
    
}
