import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../Style/ArtworkActions.css';

const ArtworkActions = ({ artwork, viewGallery, onActionComplete }) => {
  const { user, savedArtworks, saveArtworkContext, removeArtworkContext, collections, createCollection, addArtworkToCollection } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

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
      onActionComplete();
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
      onActionComplete();
    } catch (error) {
      console.error('Error removing artwork:', error);
    }
  };

  const handleCreateAndAddToCollection = () => {
    if (newCollectionName.trim() !== '') {
      createCollection(newCollectionName);
      addArtworkToCollection(artwork.objectID, newCollectionName);
      setNewCollectionName('');
      setShowDropdown(false);
    }
  };

  return (
    <div className="artwork-actions">
      {!savedArtworks.has(artwork.objectID) && <button className="button save-button" onClick={handleSave} title="Save to My List"></button>}
      {savedArtworks.has(artwork.objectID) && <button className="button remove-button" onClick={handleRemove} title="Remove Artwork"></button>}
      <button className="button inspect-button" onClick={handleInspect} title="View Details"></button>
      <button className="button collection-button" onClick={() => setShowDropdown(!showDropdown)} title="Manage Collections"></button>
      {viewGallery && <button className="button view-gallery-button" onClick={() => viewGallery(artwork.galleryNumber)} title="View Gallery"></button>}

      {showDropdown && (
        <div className="dropdown" onMouseLeave={() => setShowDropdown(false)}>
          <ul>
            {collections.map(col => (
              <li key={col.name}>
                <button onClick={() => addArtworkToCollection(artwork.objectID, col.name)}>{col.name}</button>
              </li>
            ))}
            <li>
              <input
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="New collection name"
              />
              <button onClick={handleCreateAndAddToCollection}>Create/Add</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArtworkActions;
