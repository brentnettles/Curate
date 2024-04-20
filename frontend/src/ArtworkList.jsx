import React, { useEffect, useState } from 'react';
import './ArtworkList.css'; // Import CSS file

function ArtworkList({ artworks, isVisible }) {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 1000); // Show overlay for 1 second
    return () => clearTimeout(timer);
  }, []);

  // Check if artworks is undefined or null, and return null if so
  if (!artworks) {
    return null;
  }

  return (
    <div className={`artwork-list-container ${isVisible ? 'slide-in' : ''}`}>
      {showOverlay && <div className="overlay"></div>}
      {artworks.map(artwork => (
        <div key={artwork.objectID} className="artwork-item">
          <h3 className="artwork-title">{artwork.title}</h3>
          <img src={artwork.primaryImageSmall} alt={artwork.title} className="artwork-image" />
          <p className="artwork-artist">Artist: {artwork.artistDisplayName}</p>
        </div>
      ))}
    </div>
  );
}

export default ArtworkList;
