import './ArtworkList.css';
import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArtworkActions from './ArtworkActions'; // Make sure the path is correct

function ArtworkList({ artworks, isVisible, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const artworkListRef = useRef(null);

  const viewArtworkDetail = (artwork) => {
    navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
  };

  // Callback to handle any updates after actions are completed
  const onActionComplete = () => {
    console.log("Action completed, refresh needed.");
    // Optionally refresh the list or perform other actions
  };

  return (
    <div ref={artworkListRef} className={`artwork-list-container ${isVisible ? 'showArt' : 'hideArt'}`}>
      {artworks.map(artwork => (
        <div key={artwork.objectID} className="artwork-item">
          <img src={artwork.primaryImageSmall} alt={artwork.title} className="artwork-image" onClick={() => viewArtworkDetail(artwork)} />
          <ArtworkActions artwork={artwork} onActionComplete={onActionComplete} />
        </div>
      ))}
    </div>
  );
}

export default ArtworkList;
