// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Questionnaire from './Questionnaire';
import Icebreaker from './IceBreaker';
import WebRTCPage from './WebRTCPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/webrtc/:roomId" element={<WebRTCPage />} />
        <Route path="/icebreaker/:roomId" element={<Icebreaker />} />
        <Route path="/" element={<Questionnaire />} />
      </Routes>
    </Router>
  );
};

export default App;
