// src/WebRTC.js
import React, { useEffect, useRef, useState } from 'react';

const WebRTC = ({ roomId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localPeerConnection = useRef(new RTCPeerConnection());
  const signalingChannel = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const localStreamRef = useRef(null);

  const toggleMute = () => {
    localStreamRef.current.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled; // Toggle audio track
    });
    setIsMuted(prev => !prev);
  };

  const toggleCamera = () => {
    localStreamRef.current.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled; // Toggle video track
    });
    setIsCameraOff(prev => !prev);
  };

  useEffect(() => {
    signalingChannel.current = new WebSocket(`wss://your-signaling-server/${roomId}`);

    const startMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream; // Save local stream
        localVideoRef.current.srcObject = stream;

        stream.getTracks().forEach(track => {
          localPeerConnection.current.addTrack(track, stream);
        });
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    startMediaStream();

    return () => {
      localPeerConnection.current.close();
      signalingChannel.current.close();
    };
  }, [roomId]);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }} />
      <div>
        <button onClick={toggleMute}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button onClick={toggleCamera}>
          {isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
        </button>
      </div>
    </div>
  );
};

export default WebRTC;
