// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Welcome from './screens/Welcome/Wecome';
// import Chat from './screens/Chat/Chat'; // Import other components you want to route to

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Welcome />} exact />
//         <Route path="/chat" element={<Chat />} />
//         {/* Add other routes here */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Welcome from './screens/Welcome/Wecome';
import Chat from './screens/Chat/Chat';
import './App.css'; // Make sure to create this CSS file for transitions

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames="fade"
        timeout={300}
      >
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
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;
