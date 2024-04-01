import React, { useRef } from 'react';
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
  const audioRef = useRef();

  // Function to handle starting the audio, triggered by user interaction
  const handleUserInteraction = () => {
    const audio = audioRef.current;
    // Check if we can play the audio
    if (audio && audio.paused) {
      audio.play().catch((e) => console.error('Error playing audio:', e));
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto" onPlay={() => console.log('Audio started playing')} onPause={() => console.log('Audio paused')}>
        <source src="../public/calming-sound.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div onClick={handleUserInteraction} onKeyDown={handleUserInteraction} tabIndex={0} role="button">
        <Router>
          <AnimatedRoutes />
        </Router>
      </div>
    </>
  );
};

export default App;
