// ChatBubble.js
import React from 'react';
import './ChatBubble.css';

const ChatBubble = ({ text, isUser , children}) => {
  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'assistant'}`}>
      {children || text}
    </div>
  );
};

export default ChatBubble;
