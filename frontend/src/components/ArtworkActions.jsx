import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveArtwork, deleteArtwork } from '../services/apiService';  // Ensure these are imported

const ArtworkActions = ({ artwork, viewGallery, onActionComplete }) => {
  const { user, savedArtworks, saveArtworkContext, removeArtworkContext } = useAuth();
  const navigate = useNavigate();

  const isSaved = savedArtworks.has(artwork.objectID);

  const handleInspect = (event) => {
    event.stopPropagation();
    navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
  };

  const handleSave = async (event) => {
    event.stopPropagation();
    if (!user) {
      console.log("Please log in to save artworks.");
      return;
    }
    const postData = {
        objectID: artwork.objectID,
        username: user.username,
        galleryNumber: artwork.galleryNumber  
    };

    try {
      await saveArtwork(postData, user.id);
      saveArtworkContext(artwork.objectID); 
      console.log("Artwork saved successfully");
      if (onActionComplete) onActionComplete();
    } catch (error) {
      console.error('Error saving artwork:', error);
    }
  };

  const handleRemove = async (event) => {
    event.stopPropagation();
    if (!user) {
      console.log("Please log in to remove artworks.");
      return;
    }
    try {
      await deleteArtwork(artwork.objectID, user.id);
      removeArtworkContext(artwork.objectID); 
      console.log("Artwork removed successfully");
      if (onActionComplete) onActionComplete();
    } catch (error) {
      console.error('Error removing artwork:', error);
    }
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
