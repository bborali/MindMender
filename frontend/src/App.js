import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Welcome from './screens/Welcome/Wecome';
import Chat from './screens/Chat/Chat';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route path="/" element={<Welcome />} />
          <Route path="/chat" element={<Chat />} />
          {/* Add other routes here */}
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  // Function to handle starting the audio, triggered by user interaction
  const startAudio = () => {
    // Check if audioRef is not null and then play the audio
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Set the volume to 20%
      const playPromise = audioRef.current.play();
      
      // In browsers that don’t yet support this functionality,
      // playPromise won’t be defined.
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Automatic playback started!
          setAudioPlaying(true);
        }).catch(error => {
          console.error('Playback failed', error);
        });
      }
    }
  };

  return (
    <Router>
      <div onClick={startAudio} role="button" tabIndex="0" onKeyDown={startAudio}>
        {/* The rest of your app */}
        <audio ref={audioRef} loop preload="auto">
          <source src="../public/uplifting-pad-texture-113842.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <AnimatedRoutes />
      </div>
    </Router>
  );
};

export default App;
