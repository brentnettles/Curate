import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSavedArtworksByUserId } from '../services/apiService';
import ArtworkActions from './ArtworkActions';
import '../Style/CollectionsPage.css';

function CollectionsPage() {
    const { user, savedArtworks } = useAuth(); // Use savedArtworks from context
    const navigate = useNavigate();
    const [fetchedArtworks, setFetchedArtworks] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchArtworks = async () => {
            try {
                console.log("Fetching artworks for user ID:", user.id);
                const artworks = await getSavedArtworksByUserId(user.id);
                console.log("Artworks fetched:", artworks);
                setFetchedArtworks(artworks);
            } catch (error) {
                console.error("Failed to fetch artworks:", error);
            }
        };

        fetchArtworks();
    }, [user, navigate]);

    // Filter active and inactive artworks based on the savedArtworks context state
    const [activeArtworks, setActiveArtworks] = useState([]);
    const [inactiveArtworks, setInactiveArtworks] = useState([]);

    useEffect(() => {
        setActiveArtworks(fetchedArtworks.filter(art => savedArtworks[art.objectID]?.isActive));
        setInactiveArtworks(fetchedArtworks.filter(art => !savedArtworks[art.objectID]?.isActive));
    }, [fetchedArtworks, savedArtworks]);

    return (
        <div className="collections-page">
            <h1>All Saved Artworks</h1>
            <div className="save-artwork-list">
                {activeArtworks.map(artwork => (
                    <div key={artwork.objectID} className="save-artwork-item">
                        <img src={artwork.primaryImageSmall} alt={artwork.title} className="save-artwork-image" />
                        <div className="save-artwork-info">
                            <h3 className="save-artwork-title">{artwork.title}</h3>
                            <p className="save-artwork-gallery">Gallery: {artwork.galleryNumber}</p>
                            <div className="artwork-actions">
                                <ArtworkActions artwork={artwork} isActive={savedArtworks[artwork.objectID]?.isActive} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2>Saved History</h2>
            <div className="saved-history">
                {inactiveArtworks.map(artwork => (
                    <div key={artwork.objectID} className="save-artwork-item">
                        <img src={artwork.primaryImageSmall} alt={artwork.title} className="save-artwork-image" />
                        <div className="save-artwork-info">
                            <h3 className="save-artwork-title">{artwork.title}</h3>
                            <p className="save-artwork-gallery">Gallery: {artwork.galleryNumber}</p>
                            <div className="artwork-actions">
                                <ArtworkActions artwork={artwork} isActive={savedArtworks[artwork.objectID]?.isActive} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CollectionsPage;
