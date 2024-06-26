
/// TESTING / STILL IN DEV 
/// LANDING PAGE TO BE MERGED WITH LOGIN PAGE

import React, { useState, useEffect } from 'react';
import '../Style/Landing.css';

function Landing() {
  const [showText, setShowText] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const colors = ['#FDFFFF', '#B10F2E', '#570000', '#280000', '#DE7C5A'];

  useEffect(() => {
    setTimeout(() => {
      setStartAnimation(true);  
    }, 100); 

    const timer = setTimeout(() => {
      setShowText(true);
    }, colors.length * 300 + 200); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      {colors.map((color, index) => (
        <div
          key={index}
          className="color-block"
          style={{
            backgroundColor: color,
            transitionDelay: `${index * 300}ms`,
            transform: startAnimation ? 'translateX(0)' : 'translateX(-100%)' 
          }}
        />
      ))}
      <div className="text-container" style={{ opacity: showText ? 1 : 0 }}>
        <h1>CURATE</h1>
        <button onClick={() => window.location.href = 'https://example.com'}>Enter Site</button>
      </div>
    </div>
  );
}

export default Landing;
