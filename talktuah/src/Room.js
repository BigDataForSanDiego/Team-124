// src/Room.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WebRTC from './WebRTC';
import Questionnaire from './Questionnaire';

const Room = () => {
  const { roomId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleQuestionnaireSubmit = (data) => {
    setUserInfo(data);
    navigate(`/webrtc/${roomId}`); // Redirect to the WebRTC page
  };

  return (
    <div>
      <h1>Multi-Meeting Room</h1>
      {userInfo ? (
        <WebRTC userInfo={userInfo} roomId={roomId} />
      ) : (
        <Questionnaire onSubmit={handleQuestionnaireSubmit} />
      )}
      <h2>Room ID: {roomId}</h2>
    </div>
  );
};

export default Room;
