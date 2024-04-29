import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

const ArtworkActions = ({ artwork, viewGallery, onActionComplete }) => {
  const { user, savedArtworks, saveArtwork, removeArtwork } = useAuth();
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
    console.log("Attempting to save artwork with data:", postData); 

    try {
      const response = await fetch(`http://127.0.0.1:5555/api/user-to-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });
      if (!response.ok) {
        throw new Error(`Failed to save artwork: ${response.statusText}`);
      }
      saveArtwork(artwork.objectID);
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
      const response = await fetch(`http://127.0.0.1:5555/api/user-to-view/${artwork.objectID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to remove artwork: ${response.statusText}`);
      }
      removeArtwork(artwork.objectID);
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
