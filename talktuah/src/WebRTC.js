import React, { useEffect, useRef, useState } from 'react';

const WebRTC = () => {
  const localVideoRef = useRef(null);
  const remoteVideoContainerRef = useRef(null);
  const [drone, setDrone] = useState(null);
  const [room, setRoom] = useState(null);
  const [peerConnections, setPeerConnections] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // Generate random room name if needed
  if (!window.location.hash) {
    window.location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
  }
  const roomHash = window.location.hash.substring(1);
  const roomName = 'observable-' + roomHash;

  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  useEffect(() => {
    const droneInstance = new window.ScaleDrone('oagjJ5S886Mh4w8E');
    setDrone(droneInstance);

    droneInstance.on('open', error => {
      if (error) {
        console.error("Error connecting to ScaleDrone:", error);
        return;
      }

      const roomInstance = droneInstance.subscribe(roomName);
      setRoom(roomInstance);

      roomInstance.on('open', error => {
        if (error) {
          console.error("Error subscribing to room:", error);
        }
      });

      roomInstance.on('members', members => {
        console.log('MEMBERS', members);
        if (members.length > 1) {
          startWebRTC(members.length === 2);
        }
      });

      roomInstance.on('data', (message, client) => {
        if (client.id === droneInstance.clientId) {
          return;
        }

        if (message.sdp) {
          const pc = peerConnections.find(pc => pc.clientId === client.id);
          if (pc) {
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
              if (pc.remoteDescription.type === 'offer') {
                pc.createAnswer().then(localDescCreated(pc)).catch(onError);
              }
            }, onError);
          }
        } else if (message.candidate) {
          const pc = peerConnections.find(pc => pc.clientId === client.id);
          if (pc) {
            pc.addIceCandidate(new RTCIceCandidate(message.candidate), onSuccess, onError);
          }
        }
      });
    });

    return () => {
      if (droneInstance) {
        droneInstance.close();
      }
      peerConnections.forEach(pc => pc.close());
    };
  }, [roomName]);

  const onSuccess = () => {};
  const onError = (error) => {
    console.error("WebRTC Error:", error);
  };

  const sendMessage = (message) => {
    if (room) {
      room.publish({ message });
    } else {
      console.error("Room is not initialized.");
    }
  };

  const startWebRTC = (isOfferer) => {
    const newPeerConnection = new RTCPeerConnection(configuration);
    setPeerConnections(prev => [...prev, newPeerConnection]);

    newPeerConnection.onicecandidate = event => {
      if (event.candidate) {
        sendMessage({ 'candidate': event.candidate });
      }
    };

    newPeerConnection.ontrack = event => {
      const stream = event.streams[0];
      let remoteVideo = document.createElement('video');
      remoteVideo.autoplay = true;
      remoteVideo.style.width = '300px';
      remoteVideo.srcObject = stream;

      // Append to the remote video container
      remoteVideoContainerRef.current.appendChild(remoteVideo);
    };

    if (isOfferer) {
      newPeerConnection.onnegotiationneeded = () => {
        newPeerConnection.createOffer().then(localDescCreated(newPeerConnection)).catch(onError);
      };
    }

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    }).then(stream => {
      localVideoRef.current.srcObject = stream;
      setLocalStream(stream);
      stream.getTracks().forEach(track => newPeerConnection.addTrack(track, stream));
    }).catch(err => {
      console.error("Error accessing media devices:", err);
    });
  };

  const localDescCreated = (pc) => (desc) => {
    pc.setLocalDescription(desc, () => sendMessage({ 'sdp': pc.localDescription }), onError);
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }} />
      <div ref={remoteVideoContainerRef} style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}></div>
      <div>
        <button onClick={() => {
          setIsMuted(prev => !prev);
          localStream.getAudioTracks().forEach(track => {
            track.enabled = !isMuted;
          });
        }}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button onClick={() => {
          setIsCameraOff(prev => !prev);
          localStream.getVideoTracks().forEach(track => {
            track.enabled = !isCameraOff;
          });
        }}>
          {isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
        </button>
      </div>
      <div>
        <button onClick={() => {
          const newRoomId = Math.floor(Math.random() * 0xFFFFFF).toString(16);
          window.location.hash = newRoomId;
          window.location.reload();
        }}>
          Skip to New Room
        </button>
      </div>
    </div>
  );
};

export default WebRTC;
