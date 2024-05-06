import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveArtwork, markArtworkAsInactive } from '../services/apiService';
import ManageCollections from './ManageCollections';
import '../Style/ArtworkActions.css';

const ArtworkActions = ({ artwork }) => {
  const { user, savedArtworks, saveArtworkContext, removeArtworkContext } = useAuth();
  const navigate = useNavigate();
  const [showManageCollections, setShowManageCollections] = useState(false);

  const handleInspect = () => {
    navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
  };

  const handleSave = async () => {
    if (!user) {
      alert("Please log in to save artworks.");
      return;
    }
    const artworkData = { objectID: artwork.objectID, galleryNumber: artwork.galleryNumber };
    try {
      await saveArtwork(artworkData, user.id);
      saveArtworkContext(artworkData);
      console.log("Artwork saved successfully:", artworkData);
    } catch (error) {
      console.error('Error saving artwork:', error);
    }
  };

  const handleRemove = async () => {
    console.log('Remove button clicked');
    console.log('Artwork and objectID are defined:', artwork.objectID);
    try {
      await markArtworkAsInactive(artwork.objectID, user.id);
      removeArtworkContext(artwork.objectID);
      console.log('Artwork marked as inactive');
    } catch (error) {
      console.error('Error updating artwork status:', error);
    }
  };

  return (
    <div className="artwork-actions">
      {!savedArtworks[artwork.objectID]?.isActive ? (
        <button className="button save-button" onClick={handleSave} title="Save to My List"></button>
      ) : (
        <button className="button remove-button" onClick={handleRemove} title="Remove Artwork"></button>
      )}
      <button className="button inspect-button" onClick={handleInspect} title="View Details"></button>
      <button className="button collection-button" onClick={() => setShowManageCollections(true)} title="Manage Collections"></button>
      {showManageCollections && <ManageCollections artwork={artwork} onClose={() => setShowManageCollections(false)} />}
    </div>
  );
};

export default ArtworkActions;
