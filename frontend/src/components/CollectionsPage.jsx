import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSavedArtworksByUserId, getCollectionsByUserId, getArtworksByCollectionId } from '../services/apiService';
import ArtworkActions from './ArtworkActions';
import '../Style/CollectionsPage.css';

function CollectionsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [fetchedArtworks, setFetchedArtworks] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedCollectionId, setSelectedCollectionId] = useState('all');
    const [artworksDetails, setArtworksDetails] = useState([]);
    const [inactiveArtworks, setInactiveArtworks] = useState([]);
    const [isListVisible, setIsListVisible] = useState(false); // State to control the visibility of the list

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const artworks = await getSavedArtworksByUserId(user.id);
            const { collections } = await getCollectionsByUserId(user.id);
            setFetchedArtworks(artworks);
            setInactiveArtworks(artworks.filter(art => !art.is_active));
            setCollections(collections);
            if (selectedCollectionId === 'all') {
                setArtworksDetails(artworks.filter(art => art.is_active));
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const updateArtworksDetails = async () => {
        if (selectedCollectionId !== 'all') {
            try {
                const data = await getArtworksByCollectionId(selectedCollectionId);
                setArtworksDetails(data.artworks);
            } catch (error) {
                console.error("Failed to fetch artworks for the collection:", error);
            }
        } else {
            setArtworksDetails(fetchedArtworks.filter(art => art.is_active));
        }
    };

    useEffect(() => {
        updateArtworksDetails();
    }, [selectedCollectionId]);

    const handleUpdate = () => {
        fetchData();  // Refresh data to reflect changes in the UI
    };

    const updateArtworkStatus = (artworkId, isActive) => {
        // Update fetchedArtworks to reflect the change
        const updatedArtworks = fetchedArtworks.map(artwork =>
            artwork.objectID === artworkId ? { ...artwork, is_active: isActive } : artwork
        );
        setFetchedArtworks(updatedArtworks);

        // Filter inactive artworks again
        setInactiveArtworks(updatedArtworks.filter(art => !art.is_active));

        // Optionally, update artworksDetails if needed
        if (selectedCollectionId !== 'all') {
            setArtworksDetails(updatedArtworks.filter(art => art.is_active && selectedCollectionId === art.collectionId));
        } else {
            setArtworksDetails(updatedArtworks.filter(art => art.is_active));
        }
    };

    const toggleListVisibility = () => {
        setIsListVisible(!isListVisible); // Toggle the visibility state
    };

    const viewArtworkDetail = (artwork) => {
        navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
    };

    const handleMouseLeave = () => {
        setIsListVisible(false);
    };
    
    return (
        <div className="collections-page">
            <button onClick={toggleListVisibility} className="toggle-list-button">
            {isListVisible ? '∆' : 'SELECT COLLECTION'}
            </button>
            <ul className={`collection-selector ${isListVisible ? 'active' : ''}`} onMouseLeave={handleMouseLeave}>
                <li onClick={() => setSelectedCollectionId('all')}>
                    All Collections
                </li>
                {collections.map((collection) => (
                    <li key={collection.id} onClick={() => setSelectedCollectionId(String(collection.id))}>
                        {collection.name}
                    </li>
                ))}
            </ul>
            <h1 className='selected-header'>{selectedCollectionId === 'all' ? 'ALL SAVED ARTWORKS' : collections.find(c => c.id === parseInt(selectedCollectionId))?.name || 'Filtered Artworks'}</h1>
            <div className="save-artwork-list">
            {artworksDetails.map((artwork, index) => (
            <div key={artwork.objectID || index} className="save-artwork-item">
                <img src={artwork.primaryImageSmall} alt={artwork.title} onClick={() => viewArtworkDetail(artwork)} className="save-artwork-image" />
                <div className="save-artwork-info">
                    <h3 className="save-artwork-title">{artwork.title}</h3>
                    <p className="save-artwork-gallery">Gallery: {artwork.galleryNumber}</p>
                    <ArtworkActions artwork={artwork} isActive={artwork.is_active} onUpdate={handleUpdate} onStatusChange={updateArtworkStatus} />
                </div>
            </div>
        ))}
            </div>
            <div className="separator-history"></div>
            <h2 className='saved-header'>SAVED HISTORY</h2>
            <div className="separator-history"></div>
            <div className="history-list-container">
                {inactiveArtworks.map((artwork, index) => (
                    <div key={artwork.objectID || index} className="history-artwork-item">
                        <div className="history-artwork-image-container">
                            <img src={artwork.primaryImageSmall} alt={artwork.title} onClick={() => viewArtworkDetail(artwork)} className="history-artwork-image" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CollectionsPage;
