import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Make sure the path is correct

const ArtworkActions = ({ artwork, viewGallery }) => {
  const { savedArtworks, saveArtwork, removeArtwork } = useAuth();
  const navigate = useNavigate();

  const isSaved = savedArtworks.has(artwork.objectID);

  const handleInspect = (event) => {
    event.stopPropagation();
    navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
  };

  const handleSave = (event) => {
    event.stopPropagation();
    saveArtwork(artwork.objectID);
  };

  const handleRemove = (event) => {
    event.stopPropagation();
    removeArtwork(artwork.objectID);
  };

  return (
    <div className="artwork-actions">
      {!isSaved && <button onClick={handleSave}>Save</button>}
      {isSaved && <button onClick={handleRemove}>Remove</button>}
      <button onClick={handleInspect}>Inspect</button>
      {viewGallery && <button onClick={() => viewGallery(artwork.galleryNumber)}>View Gallery</button>}
    </div>
  );
};

export default ArtworkActions;
