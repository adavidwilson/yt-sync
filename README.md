# yt-sync

A super minimal, fully P2P, WebRTC-based, infrastructure-, and dependency-free
synchronization utility for watching YouTube with friends written in pure HTML,
CSS, and JS. Should work in any modern browser with WebRTC support, but use a
Chromium-based browser for the best experience!

## Features

Please excuse the current state of the code. This was thrown together quickly
mostly for proof-of-concept and quick use. Things will be refactored over the
coming days/weeks.

Supports viewing any videos from YouTube that allow embedded playback. Peer
connections must manually be configured using the connection options on the
bottom (avoids the need for a signaling server). Playing, pausing, seeking, and
video changing are all synced by propagating messages to all the peers in the
network. Currently supports (theoretically) unlimited peers, technically limited
by the max simultaneous WebRTC connections limit of your browser
([500 per peer as of 2019 in Chrome](https://stackoverflow.com/questions/16015304/webrtc-peer-connections-limit)),
via an extremely hacky array of `RTCPeerConnection` objects.

## Contributing

If there is anything you feel is missing or not working correctly, or you just have ideas on how to make this even better, submit an issue!

## TODO

- [ ] Refactor Code w/better practice:
    - [MDN Example](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Simple_RTCDataChannel_sample)
- [ ] Add playlist queue
- [ ] Add built-in text chat
- [ ] Add built-in video/audio chat

## License

Copyright (C) 2021  David A. Wilson

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.