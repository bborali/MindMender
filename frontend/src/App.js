// export default App;

import React, { useState, useEffect,useRef } from 'react';
import './App.css';
import ChatBubble from './ChatBubble';


function App() {
  const [transcript, setTranscript] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If there's a new audio URL and the audio element exists, play it
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(e => console.error('Playback failed:', e));
    }
  }, [audioUrl]); // This effect runs when audioUrl changes


  const startRecording = () => {
    setIsLoading(true); // Show loading indicator
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(1024, 1, 1);
  
        source.connect(processor);
        processor.connect(audioContext.destination);
  
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder); // Assuming setMediaRecorder is a setState function for mediaRecorder state
  
        let silenceStart = performance.now();
        const silenceThreshold = 1500; // 1.5 seconds
        const volumeThreshold = 0.02; // Volume threshold to consider as silence
  
        processor.onaudioprocess = (event) => {
          const input = event.inputBuffer.getChannelData(0);
          let sum = 0;
  
          for (let i = 0; i < input.length; ++i) {
            sum += input[i] * input[i];
          }
          const volume = Math.sqrt(sum / input.length);
  
          if (volume < volumeThreshold) {
            if (silenceStart === null) {
              silenceStart = performance.now();
            } else if (performance.now() - silenceStart > silenceThreshold) {
              recorder.stop(); // This recorder is defined because it's in the same function scope
              processor.disconnect();
              source.disconnect();
              setIsRecording(false);
            }
          } else {
            silenceStart = null;
          }
        };
  
        recorder.ondataavailable = async (e) => {
          const audioBlob = e.data;
          if (audioBlob.size > 0) {
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.mp4'); // Change 'recording.webm' to 'recording.mp4' if you convert it on the client-side
        
            // Replace 'your-backend-endpoint' with your actual Flask backend endpoint
            fetch('http://127.0.0.1:5000/transcribe_audio', {
              method: 'POST',
              body: formData,
            })
            .then(response => response.json())
            .then(data => {
              const userRequest = data.UserRequest
              const answer = data.Answer;

              // Add user's transcribed text to the chat
              addMessageToTranscript(userRequest, true);

              // Add the generated text from the backend to the chat
              addMessageToTranscript(answer, false);
              const audioBase64 = data.AudioContent;
              const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))], { type: 'audio/mp3' });
              setAudioUrl(URL.createObjectURL(audioBlob));

              console.log(data)
              
              
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          }
        };
        
  
        recorder.start();
        setIsRecording(true);
      })
      .catch(err => console.log(err));
  };


  
  // Helper function to update the transcript state
  const addMessageToTranscript = (text, isUser) => {
    const newEntry = { text, isUser };
    setTranscript(transcript => [...transcript, newEntry]);
    setIsLoading(false); // Hide loading indicator
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop(); // This will trigger the ondataavailable event and send the last chunk of audio
      setIsRecording(false);
    }
  };

  // Your existing JSX and functions

  // return (

  //     <div className="App">
  //     <header className="App-header">
  //       Welcome to MindMender.
  //     </header>
  //     <div className="chat-window">
  //       {transcript.map((entry, index) => (
  //         <ChatBubble key={index} text={entry.text} isUser={entry.isUser} />
  //       ))}
  //     </div>
  //     <button onClick={isRecording ? stopRecording : startRecording}>
  //     {isRecording ? '' : 'Start Session'}
  //     {isLoading && (
  //       <div className="loading-dots">
  //         <span></span>
  //         <span></span>
  //         <span></span>
  //       </div>
  //     )}
  //   </button>
  //     {audioUrl && <audio ref={audioRef} src={audioUrl} autoPlay />}
  //   </div>
  // );

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
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "I'm listening..." : isLoading ? (
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : 'Start Session'}
      </button>
      {audioUrl && <audio ref={audioRef} src={audioUrl} autoPlay />}
    </div>
  );
  
}

export default App;
