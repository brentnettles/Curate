import React, { useEffect, useRef } from 'react';
import './ArtworkList.css'; // Import CSS file

function ArtworkList({ artworks, isVisible, onClose }) {
  const artworkListRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (artworkListRef.current && !artworkListRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  useEffect(() => {
    // This effect ensures that any changes in isVisible from the parent are respected
    if (!isVisible) {
      onClose();  // This could call any additional logic when visibility is turned off
    }
  }, [isVisible, onClose]);

  if (!artworks) {
    return null;
  }

  return (
    <div ref={artworkListRef} className={`artwork-list-container ${isVisible ? 'showArt' : 'hideArt'}`}>
      {artworks.map(artwork => (
        <div key={artwork.objectID} className="artwork-item" onClick={() => onClose()}>
          <img src={artwork.primaryImageSmall} alt={artwork.title} className="artwork-image" />
          {/* <p className="artwork-artist">Artist: {artwork.artistDisplayName}</p> */}
        </div>
      ))}
    </div>
  );
}

export default ArtworkList;
