import React, { useState, useEffect } from 'react';
import { fetchScavengerHunt } from '../services/apiService'; 
import '../Style/discover.css';

function ScavengerHunt() {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateHunt = async () => {
        setLoading(true);
        try {
            const response = await fetchScavengerHunt();  // Fetch data
            const data = response.artworks;
            console.log("Received:", data);
    
            const initializedArtworks = data.map(art => ({ ...art, found: false }));
            setArtworks(initializedArtworks);
            setError('');
        } catch (err) {
            console.error('Failed to fetch artworks:', err);
            setError('Failed to load artworks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Scavenger Hunt</h1>
            <p>Explore the Met. A selection of artworks will be provided to you. Seek out the item and use the information provided on the object's Title Card to confirm you've located the artwork.</p>
            <button onClick={handleGenerateHunt} className="scavenger-generate-hunt-button">Generate Scavenger Hunt</button>
            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                <div className="scavenger-artwork-list">
                    {artworks.map(art => (
                        <div key={art.objectID} className={`scavenger-artwork-item ${art.found ? 'scavenger-found' : ''}`}>
                            <div className="scavenger-artwork-image-container">
                                <img src={art.primaryImageSmall} alt={art.title} className="scavenger-artwork-image" />
                            </div>
                            <div className="scavenger-artwork-info">
                                <h3 className="scavenger-artwork-title">{art.title}</h3>
                                <p className="scavenger-artwork-gallery">Gallery Number: {art.galleryNumber}</p>
                                <button onClick={() => markAsFound(art.objectID)} disabled={art.found}>
                                    {art.found ? 'Found' : 'Mark as Found'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ScavengerHunt;
