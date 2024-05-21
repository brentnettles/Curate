import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCollectionsByUserId, getArtworksByCollectionId, deleteCollection } from '../services/apiService';
import ArtworkActions from './ArtworkActions';
import '../Style/CollectionsPage.css';

function CollectionsPage() {
    const { user, fetchSavedArtworks, savedArtworks } = useAuth();
    const navigate = useNavigate();
    const [collections, setCollections] = useState([]);
    const [selectedCollectionId, setSelectedCollectionId] = useState('all');
    const [artworksDetails, setArtworksDetails] = useState([]);
    const [inactiveArtworks, setInactiveArtworks] = useState([]);
    const [isListVisible, setIsListVisible] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            console.log('Fetching collections and saved artworks...');
            const { collections } = await getCollectionsByUserId(user.id);
            setCollections(collections);
            await fetchSavedArtworks();
            console.log('Fetched collections:', collections);
            console.log('Fetched saved artworks:', savedArtworks);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        if (selectedCollectionId === 'all') {
            setArtworksDetails(savedArtworks.filter(art => art.isActive));
            setInactiveArtworks(savedArtworks.filter(art => !art.isActive));
        } else {
            updateArtworksDetails();
        }
    }, [selectedCollectionId, savedArtworks]);

    const updateArtworksDetails = async () => {
        if (selectedCollectionId !== 'all') {
            try {
                const data = await getArtworksByCollectionId(selectedCollectionId);
                const artworks = data.artworks
                    .map(art => ({
                        ...art,
                        isActive: savedArtworks.some(savedArt => savedArt.objectID === art.objectID && savedArt.isActive)
                    }))
                    .filter(art => art.isActive); // Ensure only active artworks are displayed
                setArtworksDetails(artworks);
                console.log('Fetched artworks for collection:', artworks);
            } catch (error) {
                console.error("Failed to fetch artworks for the collection:", error);
            }
        }
    };

    const handleUpdate = () => {
        fetchSavedArtworks();
    };

    const updateArtworkStatus = (artworkId, isActive) => {
        setArtworksDetails(prev => prev.map(artwork =>
            artwork.objectID === artworkId ? { ...artwork, isActive } : artwork
        ));
        setInactiveArtworks(prev => prev.map(artwork =>
            artwork.objectID === artworkId ? { ...artwork, isActive: !isActive } : artwork
        ));
    };

    const toggleListVisibility = () => {
        setIsListVisible(!isListVisible);
    };

    const viewArtworkDetail = (artwork) => {
        navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
    };

    const handleMouseLeave = () => {
        setIsListVisible(false);
    };

    const handleDeleteCollection = async (collectionId) => {
        try {
            await deleteCollection(collectionId, user.id);
            console.log("Collection deleted successfully");
            const updatedCollections = collections.filter(collection => collection.id !== collectionId);
            setCollections(updatedCollections);

            if (selectedCollectionId === String(collectionId)) {
                setSelectedCollectionId('all');
                updateArtworksDetails(); 
            }
        } catch (error) {
            console.error("Failed to delete collection:", error);
        }
    };

    const truncateTitle = (title, maxLength = 25) => {
        if (title.length > maxLength) {
            return title.slice(0, maxLength) + ' [...]';
        }
        return title;
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
                {[...collections].reverse().map((collection) => (
                    <li key={collection.id}>
                        <span onClick={() => setSelectedCollectionId(String(collection.id))}>
                            {collection.name}
                        </span>
                        <button onClick={() => handleDeleteCollection(collection.id)} className="delete-collection-button">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <h1 className='selected-header'>{selectedCollectionId === 'all' ? 'ALL SAVED ARTWORKS' : collections.find(c => c.id === parseInt(selectedCollectionId))?.name || 'Filtered Artworks'}</h1>
            
            <div className="save-artwork-list">
                {[...artworksDetails].reverse().map((artwork, index) => (
                    <div key={artwork.objectID || index} className="save-artwork-item">
                        <img src={artwork.primaryImageSmall} alt={artwork.title} onClick={() => viewArtworkDetail(artwork)} className="save-artwork-image" />
                        <div className="save-artwork-info">
                        <h3 className="save-artwork-title">
                            {truncateTitle(artwork.title)}
                            <span className="full-title-tooltip">{artwork.title}</span>
                        </h3>
                        <p className="save-artwork-gallery">Gallery: {artwork.galleryNumber}</p>
                        <ArtworkActions artwork={artwork} isActive={artwork.isActive} onUpdate={handleUpdate} onStatusChange={updateArtworkStatus} />
                    </div>
                    </div>
                ))}
            </div>
    
            <div className="separator-history"></div>
            <h2 className='saved-header'>SAVED HISTORY</h2>
            <div className="separator-history"></div>
            <div className="history-list-container">
                {[...inactiveArtworks].reverse().map((artwork, index) => (
                    <div key={artwork.objectID || index} className="history-artwork-item">
                        <div className="history-artwork-image-container">
                            <img
                                src={artwork.primaryImageSmall}
                                alt={artwork.title}
                                onClick={() => viewArtworkDetail(artwork)}
                                className="history-artwork-image"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CollectionsPage;
