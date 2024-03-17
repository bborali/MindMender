import React, { useState } from 'react';
import './App.css';

function App() {
  const [transcript, setTranscript] = useState([]);

  const startSession = () => {
    console.log("Session started");
    // Implement your start session logic here
  };

  const addMessageToTranscript = (message, isUser = true) => {
    setTranscript([...transcript, { message, isUser }]);
  };

  return (
    <div className="App">
      <header className="App-header">
        Welcome to MindMender.
      </header>
      <div className="container">
        <button onClick={startSession}>Start your session</button>
        <div className="transcript">
          {transcript.map((entry, index) => (
            <div key={index} className={`message ${entry.isUser ? 'user' : 'assistant'}`}>
              {entry.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
