import React from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router v6
import './Welcome.css'; // Assuming you will use CSS for styling
import PopUp from '../../components/PopUp/PopUp';

const WelcomeScreen = () => {
  let navigate = useNavigate();

  const handleStartClick = () => {
    // Navigation logic here
    navigate('/chat'); // Replace '/your-next-route' with the actual path
  };



  return (
    <div className="route-section">
        <div className="welcome-screen">
            <h1>Welcome to MindMender.</h1>
            <button className="button" onClick={handleStartClick}>Start</button>
            <PopUp />
        </div>

    </div>
    
  );
};

export default WelcomeScreen;
