// ChatBubble.js
import React from 'react';
import './ChatBubble.css';

const ChatBubble = ({ text, isUser }) => {
  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}>
      {text}
    </div>
  );
};

export default ChatBubble;