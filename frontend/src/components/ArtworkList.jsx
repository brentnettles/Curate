import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArtworkActions from './ArtworkActions';

function ArtworkList({ artworks, isVisible, setIsVisible, refreshArtworks }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!artworks.length && !loading) {
      setError('No artworks to display.');
    } else {
      setError('');
    }
    setLoading(false);
  }, [artworks, loading]);

  const viewArtworkDetail = (artwork) => {
    navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className={`artwork-list-container ${isVisible ? 'showArt' : 'hideArt'}`}>
      <div className="button-container">
        <button className="close-button" onClick={handleClose}></button>
      </div>
      {loading ? (
        <p>Loading artworks...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        artworks.map(artwork => (
          <div key={artwork.objectID} className="artwork-item">
            <div className="artwork-details">
              <ArtworkActions artwork={artwork} onActionComplete={refreshArtworks} />
            </div>
            <div className="artwork-image-container" onClick={() => viewArtworkDetail(artwork)}>
              <img src={artwork.primaryImageSmall} alt={artwork.title} className="artwork-image" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ArtworkList;
