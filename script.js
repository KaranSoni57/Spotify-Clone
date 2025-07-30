console.log("Let's Go!");
let currentSong = new Audio();
let songs;

function formatTime(seconds) {
  const totalSeconds = Math.floor(seconds); // Ignore milliseconds
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const formattedSecs = secs < 10 ? `0${secs}` : secs;
  return `${mins}:${formattedSecs}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  // audio.play();

  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "Images/pause.svg";
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};
async function main() {
  songs = await getSongs();
  playMusic(songs[0], true);
  console.log(songs);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  console.log(songUL);
  for (const song of songs) {
    songUL.innerHTML += `<li>
    
              <img
                class="invert"
                src="Images/music-note-svgrepo-com.svg"
                alt=""
              />
              <div class="songinfo">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Artist</div>
                
              </div> 
              <img class="invert" src="Images/play-svgrepo-com.svg" alt="" />
            
     </li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".songinfo").firstElementChild.innerHTML);
      playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML);
    });
  });
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "Images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "Images/play-svgrepo-com.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".mMenu").addEventListener("click", () => {
    document.querySelector(".library").style.left = 0;
    document.querySelector("#menuImg").src = "Images/close.svg";
  });

  prev.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  // let audio = new Audio("songs/" + songs[0]);
  // audio.play();

  // audio.addEventListener("loadeddata", () => {
  //   let duration = audio.duration;
  //   console.log(duration);
  // });
}
main();
