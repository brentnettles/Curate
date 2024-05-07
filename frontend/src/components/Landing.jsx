import React, { useState, useEffect } from 'react';
import '../Style/Landing.css';

function Landing() {
  const [showText, setShowText] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const colors = ['#FDFFFF', '#B10F2E', '#570000', '#280000', '#DE7C5A'];

  useEffect(() => {
    setTimeout(() => {
      setStartAnimation(true);  // Start the animation after component mounts
    }, 100); // Small delay to ensure the initial render completes

    const timer = setTimeout(() => {
      setShowText(true);
    }, colors.length * 300 + 200); // Time before text appears

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
            transitionDelay: `${index * 300}ms`, // Delay each block
            transform: startAnimation ? 'translateX(0)' : 'translateX(-100%)' // Trigger the slide in
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
