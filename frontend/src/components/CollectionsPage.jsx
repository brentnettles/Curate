import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ArtworkActions from './ArtworkActions';
import ScavengerHunt from './Hunt';
import '../Style/CollectionsPage.css';

function CollectionsPage() {
    const [artworks, setArtworks] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('All');
    const [showScavengerHunt, setShowScavengerHunt] = useState(false);
    const [showCollectionsSelector, setShowCollectionsSelector] = useState(false);
    const { user, collections, removeCollection } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            alert('Please log in to view saved artworks.');
            navigate('/login');
            return;
        }

        fetch(`http://localhost:5555/api/user-artworks/${user.username}`)
            .then(response => response.json())
            .then(data => {
                if (data.artworks) {
                    setArtworks(data.artworks);
                }
            })
            .catch(error => console.error('Failed to fetch artworks:', error));
    }, [user, navigate]);

    const handleSelectCollection = (collectionName) => {
        setSelectedCollection(collectionName);
        setShowScavengerHunt(false);  // Hide Scavenger Hunt when selecting a collection
    };

    const handleDeleteCollection = async (collectionId) => {
        if (window.confirm("Are you sure you want to delete this collection?")) {
            try {
                await deleteCollection(collectionId);  
                removeCollection(collectionId);  
                if (selectedCollection === collectionId) {
                    setSelectedCollection('All');  
                }
            } catch (error) {
                console.error('Failed to delete collection:', error);
                alert('Failed to delete collection.');
            }
        }
    };

    return (
        <div>
            <h1>Collections</h1>
            <button onClick={() => setShowScavengerHunt(!showScavengerHunt)}>
                {showScavengerHunt ? 'Hide Scavenger Hunt' : 'Show Scavenger Hunt'}
            </button>
            
            <button onClick={() => setShowCollectionsSelector(!showCollectionsSelector)}>
                {showCollectionsSelector ? 'Hide Collections Selector' : 'Show Collections Selector'}
            </button>

            {showScavengerHunt && <ScavengerHunt />}

            {showCollectionsSelector && (
                <ul className={`collections-selector ${showCollectionsSelector ? 'active' : ''}`}>
                    <li onClick={() => handleSelectCollection('All')}
                        className={selectedCollection === 'All' ? 'active' : ''} 
                        key="all">
                        All Saved Artworks
                    </li>
                    {collections.map(col => (
                        <li key={col.id} className={selectedCollection === col.name ? 'active' : ''}>
                            <span onClick={() => handleSelectCollection(col.name)}>{col.name}</span>
                            <button onClick={() => handleDeleteCollection(col.id)}>🗑️</button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="save-artwork-list">
                {selectedCollection === 'All'
                    ? artworks.map(artwork => (
                        <div key={artwork.objectID} className="save-artwork-item">
                            <img src={artwork.primaryImageSmall} alt={artwork.title} onClick={() => navigate(`/artwork/${artwork.objectID}`)} className="save-artwork-image"/>
                            <div className="save-artwork-info">
                                <h3>{artwork.title}</h3>
                                <p>Gallery: {artwork.galleryNumber}</p>
                                <ArtworkActions artwork={artwork} onActionComplete={() => setArtworks(current => current.filter(a => a.objectID !== artwork.objectID))} />
                            </div>
                        </div>
                      ))
                    : collections.find(col => col.name === selectedCollection)?.artworks.map(artwork => (
                        <ArtworkActions key={artwork.objectID} artwork={artwork} />
                      ))
                }
            </div>
        </div>
    );
}

export default CollectionsPage;
