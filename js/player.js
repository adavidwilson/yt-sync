// yt-sync | A minimal YouTube sync site for watching videos with friends.
// Copyright (C) 2021  David A. Wilson

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'M7lc1UVf-VE',
    events: {
      // 'onReady': onPlayerReady, possibly use to wait for slowest peer
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  // When the player's state changes, the event's data property will
  // specify one of the following states with namespaced constants in
  // YT.PlayerState:
  //   UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2),
  //   BUFFERING(3), CUED(4)
  //
  // On loading a new video, -1 is broadcast immediately followed by 3,
  // then 1.

  switch (event.data) {
    case YT.PlayerState.UNSTARTED:
      // Unused, maybe use to trigger video change message
      console.log("UNSTARTED");
      break;
    case YT.PlayerState.ENDED:
      // Unused, will use when playlist is implemented
      console.log("ENDED");
      break;
    case YT.PlayerState.PLAYING:
      console.log("PLAYING");
      dc.forEach(d => d.send('play'));
      const curTime = player.getCurrentTime();
      dc.forEach(d => d.send(JSON.stringify({ action: 'seek', time: curTime })));
      break;
    case YT.PlayerState.PAUSED:
      console.log("PAUSED");
      changing = changing ? false : dc.forEach(d => d.send('pause'));
      break;
    case YT.PlayerState.BUFFERING:
      // Unused, might be needed for slowest peer autoplay
      console.log("BUFFERING");
      break;
    case YT.PlayerState.CUED:
      // Unused, might be needed for playlist support
      console.log("CUED");
      break;
    default:
      console.log("Invalid player state");
      break;
  }
}
function stopVideo() {
  player.stopVideo();
}

// Maybe the button isn't needed at all except for playlist functionality...
document.querySelector("#vidBtn").addEventListener("click", () => {
  const text = document.querySelector("#ytID").value;
  changing = true;

  // RegExp courtesy of https://webapps.stackexchange.com/questions/54443/format-for-id-of-youtube-video
  const id = text.match(/[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/)[0]
  player.loadVideoById(id);
  dc.forEach(d => d.send(JSON.stringify({ action: 'changeId', id: id })));
})

document.querySelector("#ytID").addEventListener("keyup", e => {
  if (e.key === "Enter") {
    document.querySelector("#vidBtn").click();
  }
})