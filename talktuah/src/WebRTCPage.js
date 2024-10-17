// src/WebRTCPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import WebRTC from './WebRTC';

const WebRTCPage = () => {
  const { roomId } = useParams();

  return (
    <div>
      <h1>WebRTC Session</h1>
      <h2>Room ID: {roomId}</h2>
      <WebRTC roomId={roomId} />
    </div>
  );
};

export default WebRTCPage;
