// // export default Chat;

// import React, { useState, useEffect, useRef } from 'react';
// import './Chat.css';
// import ChatBubble from '../../components/ChatBubble/ChatBubble';
// import PopUp from '../../components/PopUp/PopUp';

// const Chat = () => {
//   const [transcript, setTranscript] = useState([]);
//   const [isRecording, setIsRecording] = useState(false);
//   const recognitionRef = useRef(null);
//   const silenceTimerRef = useRef(null);
//   const chatWindowRef = useRef(null);
//   const currentTranscriptRef = useRef(''); // Holds the latest transcript
//   const [interimTranscript, setInterimTranscript] = useState('');
//   // Adds message to transcript and scroll to bottom
//   const addMessageToTranscript = (message, isUser) => {
//     setTranscript(prevTranscript => [...prevTranscript, { text: message, isUser }]);
//     scrollToBottom();
  
//     // Log the final transcript of the user's message to the console
//     if (isUser) {
//       console.log("Final user transcript:", message);
      
//     }
//   };

//   useEffect(() => {
//     scrollToBottom(); // Scroll to bottom whenever the transcript changes
//   }, [transcript]); // Add transcript as a dependency

//   useEffect(() => {
//     scrollToBottom(); // Scroll to bottom whenever the transcript changes
//   }, [interimTranscript]); // Add transcript as a dependency

//   const scrollToBottom = () => {
//     if (chatWindowRef.current) {
//       chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
//     }
//   };

//     // Function to speak out the text using text-to-speech
//     const speak = (text) => {
//       const utterance = new SpeechSynthesisUtterance(text);
//       speechSynthesis.speak(utterance);
//     };
  
//     // Function to process the final transcript
//     const processFinalTranscript = async (finalTranscript) => {
//       try {
//         console.log("HERE")
//         // Use fetch or axios to make the API call
//         const response = await fetch('http://127.0.0.1:5000/process_text', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ text: finalTranscript }),
//         });
  
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
  
//         const data = await response.json();
//         // Assuming the backend returns a JSON object with a field 'answer'
//         const answer = data.answer;
  
//         // Display the answer in the chat bubble
//         addMessageToTranscript(answer, false);

//         // Read the answer out loud
//         speak(answer);
//       } catch (error) {
//         console.error('There was a problem processing the final transcript:', error);
//       }
//     };

//   // Modify the handleSilence function
//   const handleSilence = () => {
//     // Log the current transcript from the ref, not the state
//     console.log("Silence detected. ");

//     if (currentTranscriptRef.current.trim()) {
//       addMessageToTranscript(currentTranscriptRef.current, true);
//       // Call the function to process the final transcript
//       processFinalTranscript(currentTranscriptRef.current);
//       currentTranscriptRef.current = '';
//     }

//     clearTimeout(silenceTimerRef.current);
//   };

//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       const recognition = new SpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;

//       recognition.onresult = (event) => {
//         let isFinal = false;
//         let interim = '';
  
//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           if (event.results[i].isFinal) {
//             isFinal = true;
//             interim = ''; // clear interim since we have final result
//             currentTranscriptRef.current = event.results[i][0].transcript;
//           } else {
//             interim += event.results[i][0].transcript;
//           }
//         }
  
//         // Set interim results to state
//         if (!isFinal) {
//           setInterimTranscript(interim);
//         }
  
//         // If we have a final result, update the main transcript
//         if (isFinal) {
//           addMessageToTranscript(currentTranscriptRef.current, true);
//           processFinalTranscript(currentTranscriptRef.current); // Call the API with the final transcript
//           setInterimTranscript(''); // Clear interim transcript
//           currentTranscriptRef.current = ''; // Clear the current transcript ref
//         }
  
//         clearTimeout(silenceTimerRef.current);
//         silenceTimerRef.current = setTimeout(handleSilence, 2000); // Handle silence after 2 seconds
//       };

//       recognition.onstart = () => {
//         setIsRecording(true);
//       };

//       recognition.onend = () => {
//         setIsRecording(false);
//         handleSilence(); // Ensure that the transcript is processed when recognition ends
//       };

//       recognitionRef.current = recognition;
//     } else {
//       console.error('SpeechRecognition not supported in this browser.');
//     }
//   }, []);

//   const startRecording = () => {
//     currentTranscriptRef.current = ''; // Reset the current transcript
//     recognitionRef.current?.start();
//   };

//   const stopRecording = () => {
//     recognitionRef.current?.stop();
//   };

//   return (
//     <div className="route-section">
//       <div className="Chat">
//         <header className="App-header">Ready when you are...</header>
//         <div className="chat-window" ref={chatWindowRef}>
//           {transcript.map((entry, index) => (
//             <ChatBubble key={index} text={entry.text} isUser={entry.isUser} />
//           ))}
//           {/* Render interim transcript if it's not empty */}
//           {interimTranscript && <ChatBubble text={interimTranscript} isUser={true} />}
//         </div>
//         <button onClick={isRecording ? stopRecording : startRecording}>
//           {isRecording ? 'Stop Session' : 'Start Session'}
//         </button>
//         <PopUp />
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useEffect, useRef } from 'react';

import ChatBubble from '../../components/ChatBubble/ChatBubble';
import PopUp from '../../components/PopUp/PopUp';

import './Chat.css';

const Chat = () => {
  const [transcript, setTranscript] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const chatWindowRef = useRef(null);
  const currentTranscriptRef = useRef('');
  const [interimTranscript, setInterimTranscript] = useState('');

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
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      startRecording(); // Restart recording after speech has finished
    };
    speechSynthesis.speak(utterance);
  };

  const processFinalTranscript = async (finalTranscript) => {
    try {
      console.log("here")
      const response = await fetch('http://127.0.0.1:5000/process_text', {
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
      const answer = data.answer;
      addMessageToTranscript(answer, false);
      speak(answer); // Speak out the answer and restart recording afterwards
    } catch (error) {
      console.error('There was a problem processing the final transcript:', error);
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
          {/* Render interim transcript if it's not empty */}
          {interimTranscript && <ChatBubble text={interimTranscript} isUser={true} />}
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
