console.log("Let's write the JavaScript");

let currentsong = new Audio();  // Active audio element
let songs;  // Array of songs
const volimg = document.querySelector(".volimg");  // Volume icon
const volumeRange = document.getElementById("volumeRange");  // Volume slider

// Converts seconds to MM:SS format
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Fetches the list of songs
async function getsongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      let fullSongName = element.href.split("/").pop();  // Get the song name
      let songName = fullSongName.replace(".mp3", " ");  // Remove the ".mp3" extension
      songs.push(songName);
    }
  }

  return songs;
}

// Function to play a selected song
const playMusic = (track) => {
  currentsong.src = "/songs/" + encodeURIComponent(track.trim()) + ".mp3";
  currentsong.play();
  document.querySelector(".songinfo").innerHTML = track.replace(/%20/g, " ");
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
  Play.src = "assets/pause.svg";
};

// Display default song on load
const displayDefaultSong = () => {
  const defaultSong = songs[0];  // Default to the first song
  currentsong.src = "/songs/" + encodeURIComponent(defaultSong.trim()) + ".mp3";
  document.querySelector(".songinfo").innerHTML = defaultSong.replace(/%20/g, " ");
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

// Main function to load songs and handle events
async function main() {
  songs = await getsongs();
  let songul = document.querySelector(".song-list").getElementsByTagName("ul")[0];

  // Add songs to the list
  for (const song of songs) {
    songul.innerHTML += `
      <li>
        <img class="invert" src="assets/music.svg">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Saeed</div>
        </div>
        <div class="playnow">
          <span> Play Now</span>
          <img class="invert" src="assets/newplay.svg" alt="">
        </div>
      </li>`;
  }

  // Attach event listener to each song
  document.querySelectorAll(".song-list li").forEach((e) => {
    e.addEventListener("click", () => {
      let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
      playMusic(songName);
    });
  });

  // Play/Pause button functionality
  Play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      Play.src = "assets/pause.svg";
    } else {
      currentsong.pause();
      Play.src = "assets/play.svg";
    }
  });

  // Update the song's time in the playbar
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  // Seekbar functionality
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  // Volume control and mute functionality
  volumeRange.addEventListener("input", (e) => {
    const volume = e.target.value / 100;
    currentsong.volume = volume;
    if (volume === 0) {
      currentsong.muted = true;
      volimg.src = "assets/mute.svg";  // Mute icon
    } else {
      currentsong.muted = false;
      volimg.src = "assets/volume.svg";  // Volume icon
    }
  });

  // Toggle mute/unmute when volume icon is clicked
  volimg.addEventListener("click", () => {
    if (currentsong.muted) {
      currentsong.muted = false;
      volimg.src = "assets/volume.svg";  // Unmute icon
      volumeRange.value = currentsong.volume * 100;  // Update slider to current volume
    } else {
      currentsong.muted = true;
      volimg.src = "assets/mute.svg";  // Mute icon
      volumeRange.value = 0;  // Set slider to 0
    }
  });

  // Display default song information on load
  displayDefaultSong();
}

// Start the main function to load the songs and setup everything
main();
