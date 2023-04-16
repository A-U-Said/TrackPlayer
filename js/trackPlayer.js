if (document.getElementById("playlist-container") != null) {

    const playlistContainer = document.getElementById("playlist-container");
    const player = document.getElementById("playlist-player");
    const title = document.getElementById("track-title");
    
    const progressContainer = document.getElementById("progress-container");
    const progress = document.getElementById("progress");
    const progressTime = document.getElementById("progress-time");
    const playlist = document.getElementById("playlist");
    
    const prevBtn = document.getElementById("prev");
    const playBtn = document.getElementById("play");
    const nextBtn = document.getElementById("next");
    
    const plistItems = document.getElementsByClassName("playlist-item");
    const header = document.getElementById("playlist-header");
    const trackRows = document.querySelectorAll(".playlist-tracks li");
    
    let trackIndex = 0;
   
    
    function loadTrack(track) {
      title.innerText = track.Name;
      player.src = track.Url;
    }
    
    function playTrack() {
    	playlistContainer.classList.add("playing");
        const btn = playBtn.querySelector("i.fas");
        btn.classList.remove("fa-play");
        btn.classList.add("fa-pause");
        player.play();
    }
    
    function pauseTrack() {
        playlistContainer.classList.remove("playing");
        const btn = playBtn.querySelector("i.fas");
        btn.classList.remove("fa-pause");
        btn.classList.add("fa-play");
        player.pause();
    }
    
    function nextTrack() {
        trackIndex++;
        if (trackIndex > tracks.length - 1) {
            trackIndex = 0;
        }
        loadTrack(tracks[trackIndex]);
        playTrack();
    }
    
    function prevTrack() {
        trackIndex--;
        if (trackIndex < 0) {
            trackIndex = tracks.length - 1;
        }
        loadTrack(tracks[trackIndex]);
        playTrack();
    }
    
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const percent = (currentTime / duration) * 100;
        let min = Math.floor(currentTime / 60);
        if (min < 10) {
            min = "0" + String(min);
        }
        let sec = Math.floor(currentTime % 60);
        if (sec < 10) {
            sec = "0" + String(sec);
        }
        const durationMin =
            Math.floor(duration / 60) < 10
            ? "0" + String(Math.floor(duration / 60))
            : Math.floor(duration / 60);
        const durationSec =
            Math.floor(duration % 60) < 10
            ? "0" + String(Math.floor(duration % 60))
            : Math.floor(duration % 60);
        progressTime.innerHTML = `${min}:${sec} / ${
            durationMin ? durationMin : "00"
            }:${durationSec ? durationSec : "00"}`;
        progress.style.width = `${percent}%`;
    }
    
    function setProgress(e) {
        const width = this.clientWidth;
        const offsetX = e.offsetX;
        const duration = player.duration;
        player.currentTime = (offsetX / width) * duration;
    }
	
	function getDuration(src, selector) {
		var audio = new Audio();
		audio.src = src;
				
		audio.onloadedmetadata = function () {
			var duration = audio.duration;
			const durationMin =
				Math.floor(duration / 60) < 10
					? "0" + String(Math.floor(duration / 60))
					: Math.floor(duration / 60);
			const durationSec =
				Math.floor(duration % 60) < 10
					? "0" + String(Math.floor(duration % 60))
					: Math.floor(duration % 60);

			document.getElementById(selector).textContent = `${durationMin ? durationMin : "00"}:${durationSec ? durationSec : "00"}`
		};
		
	}

	hidePlaylistEntries && document.getElementById("playlist-header").classList.add("rounded-player");
	document.getElementById("track-count").innerHTML = `${tracks.length} track${tracks.length > 1 ? "s" : ""}`;
	
	if (!hidePlaylistEntries) {
		document.getElementById("playlist-tracks").innerHTML = tracks.map((track, index) => 
			`
				<li id="${index}" class="playlist-item">
					<p>${track.Name}</p>
					<p id="duration-${index}">${getDuration(track.Url, "duration-"+index)}</p>
					<p>${track.Date}</p>
				</li>
			`
		).join('');
	}

    playBtn.addEventListener("click", () => {
        if (playlistContainer.classList.contains("playing")) {
            pauseTrack();
        } else {
            playTrack();
        }
    });
    
    Array.from(plistItems).forEach(item => {
        item.addEventListener('click', (e) => {
            var targetIndex = (e.target.tagName === "LI") ? e.target.id : e.target.parentElement.id;
            loadTrack(tracks[targetIndex]);
            playTrack();
        });
    });
    
    
    prevBtn.addEventListener("click", prevTrack);
    nextBtn.addEventListener("click", nextTrack);
    
    player.addEventListener("timeupdate", updateProgress);
    player.addEventListener("ended", nextTrack);
    
    progressContainer.addEventListener("click", setProgress);
    
    loadTrack(tracks[trackIndex]);

}