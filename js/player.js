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
            // 'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        dc.forEach(d => d.send('play'));
        const curTime = player.getCurrentTime();
        dc.forEach(d => d.send(JSON.stringify({ action: 'seek', time: curTime })));
    } else if (event.data == YT.PlayerState.PAUSED) {
        dc.forEach(d => d.send('pause'));
    }
}
function stopVideo() {
    player.stopVideo();
}

const startPlayer = () => {
    // 4. The API will call this function when the video player is ready.
    // function onPlayerReady(event) {
    //     event.target.playVideo();
    // }
    player.playVideo();

}

document.querySelector("#vidBtn").addEventListener("click", () => {
    const text = document.querySelector("#ytID").value;

    if (text.includes("http")) {
        const id = text.split('=')[1];
        player.loadVideoById(id);
        dc.forEach(d => d.send(JSON.stringify({ action: 'changeId', id: id })));
    } else {
        player.loadVideoById(text);
        dc.forEach(d => d.send(JSON.stringify({ action: 'changeId', id: text })));
    }
})