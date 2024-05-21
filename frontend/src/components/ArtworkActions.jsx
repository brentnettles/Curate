import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ManageCollections from './ManageCollections';
import '../Style/ArtworkActions.css';

const ArtworkActions = ({ artwork, onStatusChange, isActive }) => {
    const { saveArtworkContext, removeArtworkContext } = useAuth();
    const navigate = useNavigate();
    const [showManageCollections, setShowManageCollections] = useState(false);

    const handleInspect = () => {
        navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
    };

    const handleSave = async () => {
        const artworkData = { objectID: artwork.objectID, galleryNumber: artwork.galleryNumber };
        await saveArtworkContext(artworkData);
        console.log("Artwork saved successfully:", artworkData);
        onStatusChange(artwork.objectID, true); // Pass true for isActive
    };

    const handleRemove = async () => {
        console.log('Remove button clicked');
        console.log('Artwork and objectID are defined:', artwork.objectID);
        await removeArtworkContext(artwork.objectID);
        console.log('Artwork marked as inactive');
        onStatusChange(artwork.objectID, false); // Pass false for isActive
    };

    return (
        <div className="artwork-actions">
            {isActive ? (
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
