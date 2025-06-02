import React from 'react';
import '../styles/Background.css';
import bgImage from '../assets/bg-img.jpg';

const Background = ({ children }) => {
  return (
    <div
      className="background-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {children}
    </div>
  );
};

export default Background;
