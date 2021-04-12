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

const peersContainer = document.querySelector("#peersContainer");
const descContainer = document.querySelector("#descContainer");

const numPeersBox = document.querySelector("#numPeers");
const peersBtn = document.querySelector("#setPeers");

const peerDescBox = document.querySelector("#peerDesc");
const offerAnswerBtn = document.querySelector("#offerAnswerBtn");

const config = { iceServers: [{ urls: "stun:stun.stunprotocol.org" }] };
const pc = [];
const dc = [];
let i = 0;

peersBtn.addEventListener("click", () => {
    numPeers = numPeersBox.value;

    peersContainer.style.display = "none";

    for (let j = 0; j < numPeers; j++) {
        pc.push(new RTCPeerConnection(config));
        // This occurs once the local description has been created
        pc[j].onicecandidate = () => {
            peerDescBox.value = JSON.stringify(pc[j].localDescription);
        }
    }
});

const onConnection = () => {
    console.log(`Connected to Peer ${i}!`);

    i++;

    console.log(i);
    if (i >= numPeers) {
        descContainer.style.display = "none";
    }
    // startPlayer();
};

const onMessage = m => {
    console.log(m.data);
    if (m.data == "play") {
        player.playVideo();
    } else if (m.data == "pause") {
        player.pauseVideo();
    } else if (JSON.parse(m.data).action == 'changeUrl') {
        player.loadVideoByUrl(`${JSON.parse(m.data).url}?version=3`);
    } else if (JSON.parse(m.data).action == 'changeId') {
        if (numPeers > 1) {
            const text = JSON.parse(m.data).id;
            dc.forEach(d => d.send(JSON.stringify({ action: 'changeId', id: text })));
        }
        player.loadVideoById(JSON.parse(m.data).id);
    } else if (JSON.parse(m.data).action == 'seek') {
        const otherTime = JSON.parse(m.data).time;
        if (Math.abs(player.getCurrentTime() - otherTime) > 2) {
            player.seekTo(JSON.parse(m.data).time);
        }
    }
};

peerDescBox.addEventListener("keyup", () => {
    if (peerDescBox.value) {
        offerAnswerBtn.textContent = "Accept";
    } else {
        offerAnswerBtn.textContent = "Create Offer";
    }
});

offerAnswerBtn.addEventListener("click", async () => {
    if (offerAnswerBtn.textContent == "Create Offer") {
        dc.push(pc[i].createDataChannel('dat'));
        dc[i].onopen = onConnection;
        dc[i].onmessage = onMessage;

        pc[i].setLocalDescription();
    } else {
        // Doesn't affect caller functionality
        pc[i].ondatachannel = e => {
            dc.push(e.channel);
            dc[i].onopen = onConnection;
            dc[i].onmessage = onMessage;
        };

        await pc[i].setRemoteDescription(JSON.parse(peerDescBox.value));
        pc[i].localDescription || pc[i].setLocalDescription();
    }
});
