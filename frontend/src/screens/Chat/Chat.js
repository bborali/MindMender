// export default Chat;

import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import ChatBubble from '../../components/ChatBubble/ChatBubble';
import PopUp from '../../components/PopUp/PopUp';

const Chat = () => {
  const [transcript, setTranscript] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const chatWindowRef = useRef(null);
  const currentTranscriptRef = useRef(''); // Holds the latest transcript
  const [interimTranscript, setInterimTranscript] = useState('');
  // Adds message to transcript and scroll to bottom
  const addMessageToTranscript = (message, isUser) => {
    setTranscript(prevTranscript => [...prevTranscript, { text: message, isUser }]);
    scrollToBottom();
  
    // Log the final transcript of the user's message to the console
    if (isUser) {
      console.log("Final user transcript:", message);
    }
  };

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  const handleSilence = () => {
    // Log the current transcript from the ref, not the state
    console.log("Silence detected.");

    // Clear the current transcript since silence is detected
    if (currentTranscriptRef.current.trim()) {
      addMessageToTranscript(currentTranscriptRef.current, true);
      currentTranscriptRef.current = '';
    }

    // Prepare for a new speech segment
    clearTimeout(silenceTimerRef.current);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let isFinal = false;
        let interim = '';
  
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            isFinal = true;
            interim = ''; // clear interim since we have final result
            currentTranscriptRef.current = event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
  
        // Set interim results to state
        if (!isFinal) {
          setInterimTranscript(interim);
        }
  
        // If we have a final result, update the main transcript
        if (isFinal) {
          addMessageToTranscript(currentTranscriptRef.current, true);
          setInterimTranscript(''); // Clear interim transcript
          currentTranscriptRef.current = ''; // Clear the current transcript ref
        }
  
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(handleSilence, 2000); // Handle silence after 2 seconds
      };

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
        handleSilence(); // Ensure that the transcript is processed when recognition ends
      };

      recognitionRef.current = recognition;
    } else {
      console.error('SpeechRecognition not supported in this browser.');
    }
  }, []);

  const startRecording = () => {
    currentTranscriptRef.current = ''; // Reset the current transcript
    recognitionRef.current?.start();
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div className="route-section">
      <div className="Chat">
        <header className="App-header">Ready when you are...</header>
        <div className="chat-window" ref={chatWindowRef}>
          {transcript.map((entry, index) => (
            <ChatBubble key={index} text={entry.text} isUser={entry.isUser} />
          ))}
          {/* Render interim transcript if it's not empty */}
          {interimTranscript && <ChatBubble text={interimTranscript} isUser={true} />}
        </div>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Session' : 'Start Session'}
        </button>
        <PopUp />
      </div>
    </div>
  );
};

export default Chat;

