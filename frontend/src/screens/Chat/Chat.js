import React, { useState, useEffect, useRef } from 'react';
import AWS from 'aws-sdk';
import ChatBubble from '../../components/ChatBubble/ChatBubble';
import PopUp from '../../components/PopUp/PopUp';
import LoadingDots from '../../components/LoadingDots/LoadingDots';
import './Chat.css';

// Load AWS credentials
import awsConfig from './aws.json'; // Adjust the path according to where your aws.json is located

const Chat = () => {
  const [transcript, setTranscript] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const chatWindowRef = useRef(null);
  const currentTranscriptRef = useRef('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  // Configure AWS
  AWS.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: 'us-east-1' // Change to your Polly region if different
  });

  const polly = new AWS.Polly({apiVersion: '2016-06-10'});

  const addMessageToTranscript = (message, isUser) => {
    setTranscript(prevTranscript => [...prevTranscript, { text: message, isUser }]);
    scrollToBottom();
    if (isUser) {
      console.log("Final user transcript:", message);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcript, interimTranscript]);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  const speak = (text) => {
    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: 'Joanna', // Choose a different voice as needed
      Engine: 'neural'
    };

    polly.synthesizeSpeech(params, (err, data) => {
      if (err) {
        console.error(err, err.stack);
      } else {
        const audioBlob = new Blob([data.AudioStream], {type: 'audio/mp3'});
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => {
          startRecording(); // Restart recording after speech has finished
        };
      }
    });
  };

  const processFinalTranscript = async (finalTranscript) => {
    try {
      setWaitingForResponse(true); // Start loading


      const response = await fetch('https://7b78-34-105-88-98.ngrok-free.app//process_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: finalTranscript }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const answer = data.answer.result;
      addMessageToTranscript(answer, false);
      speak(answer); // Speak out the answer and restart recording afterwards
    } catch (error) {
      console.error('There was a problem processing the final transcript:', error);
    } finally {
      setWaitingForResponse(false); // Stop loading
    }
  };
  

  const handleSilence = () => {
    console.log("Silence detected.");
    if (currentTranscriptRef.current.trim()) {
      addMessageToTranscript(currentTranscriptRef.current, true);
      processFinalTranscript(currentTranscriptRef.current);
      currentTranscriptRef.current = '';
      stopRecording(); // Temporarily stop recording to avoid picking up the speech synthesis
    }
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
            interim = '';
            currentTranscriptRef.current = event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (!isFinal) {
          setInterimTranscript(interim);
        }

        if (isFinal) {
          addMessageToTranscript(currentTranscriptRef.current, true);
          processFinalTranscript(currentTranscriptRef.current);
          setInterimTranscript('');
          currentTranscriptRef.current = '';
          stopRecording(); // Temporarily stop recording to avoid picking up the speech synthesis
        }

        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(handleSilence, 2000);
      };

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.error('SpeechRecognition not supported in this browser.');
    }
  }, []);

  const startRecording = () => {
    // Only start recording if speech synthesis is not speaking
    if (!speechSynthesis.speaking) {
      currentTranscriptRef.current = ''; // Reset the current transcript
      recognitionRef.current?.start();
    }
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div className="route-section">
      <div className="Chat">
        <header className="App-header">Hello, I'm MindMender</header>
        <div className="chat-window" ref={chatWindowRef}>
          {transcript.map((entry, index) => (
            <ChatBubble key={index} text={entry.text} isUser={entry.isUser} />
          ))}
          {interimTranscript && <ChatBubble text={interimTranscript} isUser={true} />}
          {/* {waitingForResponse && <ChatBubble isUser={false}><LoadingDots /></ChatBubble>} */}
          {waitingForResponse && <ChatBubble isUser={false}><LoadingDots /></ChatBubble>}
        </div>
        

        <button className="button" onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Session' : 'Start Session'}
        </button>
        <PopUp />
      </div>
    </div>
  );
};

export default Chat;



