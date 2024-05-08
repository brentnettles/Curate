import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveArtwork, markArtworkAsInactive } from '../services/apiService';
import ManageCollections from './ManageCollections';
import '../Style/ArtworkActions.css';

const ArtworkActions = ({ artwork, onStatusChange }) => {
  const { user, savedArtworks, saveArtworkContext } = useAuth();
  const navigate = useNavigate();
  const [showManageCollections, setShowManageCollections] = useState(false);

  // Check if the artwork is saved
  const isArtworkSaved = savedArtworks.some(art => art.objectID === artwork.objectID && art.isActive);

  const handleInspect = () => {
    navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
  };

  const handleSave = async () => {
    const artworkData = { objectID: artwork.objectID, galleryNumber: artwork.galleryNumber };
    await saveArtwork(artworkData, user.id);
    saveArtworkContext(artworkData);
    console.log("Artwork saved successfully:", artworkData);
};

  // Remove artwork from saved list and mark as inactive 
  //(is_active: false) to create the Saved History
  const handleRemove = async () => {
    console.log('Remove button clicked');
    console.log('Artwork and objectID are defined:', artwork.objectID);
    await markArtworkAsInactive(artwork.objectID, user.id);
    console.log('Artwork marked as inactive');
    onStatusChange(artwork.objectID, false);
};

  return (
    <div className="artwork-actions">
      {isArtworkSaved ? (
        <button className="button remove-button" onClick={handleRemove} title="Remove Artwork"></button>
      ) : (
        <button className="button save-button" onClick={handleSave} title="Save to My List"></button>
      )}
      <button className="button inspect-button" onClick={handleInspect} title="View Details"></button>
      <button className="button collection-button" onClick={() => setShowManageCollections(true)} title="Manage Collections"></button>
      {showManageCollections && <ManageCollections artwork={artwork} onClose={() => setShowManageCollections(false)} />}
    </div>
  );
};

export default ArtworkActions;
