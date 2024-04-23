import React, { useEffect, useRef } from 'react';
import './ArtworkList.css'; // Import CSS file

function ArtworkList({ artworks, isVisible, onClose }) {
  const artworkListRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the target is inside artworkList or if the click is on the recenter button
      if (artworkListRef.current && !artworkListRef.current.contains(event.target) &&
          !event.target.closest('#recenter-button')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  if (!artworks) {
    return null;
  }

  return (
    <div ref={artworkListRef} className={`artwork-list-container ${isVisible ? 'showArt' : 'hideArt'}`}>
      {artworks.map(artwork => (
        <div key={artwork.objectID} className="artwork-item" onClick={() => onClose()}>
          <img src={artwork.primaryImageSmall} alt={artwork.title} className="artwork-image" />
          {/* Optionally, display the artist name or other information */}
        </div>
      ))}
    </div>
  );
}

export default ArtworkList;
