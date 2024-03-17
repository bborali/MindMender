import React, { useState } from 'react';
import './App.css';
import ChatBubble from './ChatBubble';
import { sendToBackend } from './api/api';

function App() {
  const [transcript, setTranscript] = useState([]);

  // const startSession = () => {
  //   console.log("Session started");
  //   // Implement your start session logic here
  // };

  const addMessageToTranscript = (message, isUser = true) => {
    setTranscript([...transcript, { message, isUser }]);
  };

  const startSession = () => {
    fetch('http://127.0.0.1:5000/start_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // If you need to send data to the backend, stringify it here
      // body: JSON.stringify({ data: yourData }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Handle the response data from the Flask app
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const [message, setMessage] = useState('');

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newTranscript = [...transcript, { text: message, isUser: true }];
      setTranscript(newTranscript);
      setMessage('');

      // Here you would make the API call to the backend
      // And then append the response to the transcript
      // For example:
      sendToBackend(message).then(response => {
        console.log("Reeponse from backend: "+response.response)
        setTranscript([...newTranscript, { text: response.response, isUser: false }]);
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        Welcome to MindMender.
      </header>
      <div className="chat-window">
        {transcript.map((entry, index) => (
          <ChatBubble key={index} text={entry.text} isUser={entry.isUser} />
        ))}
      </div>
      <form onSubmit={handleMessageSend} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default App;
