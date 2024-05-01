import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveArtwork, deleteArtwork } from '../services/apiService'; 
import '../Style/ArtworkActions.css';

const ArtworkActions = ({ artwork, viewGallery, onActionComplete }) => {
  const { user, savedArtworks, saveArtworkContext, removeArtworkContext } = useAuth();
  const navigate = useNavigate();

  const isSaved = savedArtworks.has(artwork.objectID);

  const handleInspect = (event) => {
    event.stopPropagation();
    navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
  };

  const handleSave = async (event) => {
    event.preventDefault(); 
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
  {!savedArtworks.has(artwork.objectID) && <button className="button save-button" onClick={handleSave} title="Save to My List"></button>}
  {savedArtworks.has(artwork.objectID) && <button className="button remove-button" onClick={handleRemove} title="Remove Artwork"></button>}
  <button className="button inspect-button" onClick={handleInspect} title="View Details"></button>
  {viewGallery && <button className="button view-gallery-button" onClick={() => viewGallery(artwork.galleryNumber)} title="View Gallery">View Gallery</button>}
</div>
  );
};

export default ArtworkActions;
