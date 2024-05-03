import React, { useState, useEffect } from 'react';
import { fetchScavengerHunt } from '../services/apiService'; // Ensure correct path
import '../Style/Scavenger.css';

function ScavengerHunt() {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateHunt = async () => {
        setLoading(true);
        try {
            const response = await fetchScavengerHunt();  // Fetch data
            const data = response.artworks; 
            //Tetsing
            console.log("Received:", data);
    
            
            const initializedArtworks = data.map(art => ({ ...art, found: false }));
            setArtworks(initializedArtworks);
            setError('');
            console.log("Scavenger Hunt artworks loaded:", initializedArtworks.map(art => ({ objectID: art.objectID, title: art.title }))); // Log the loaded artworks with their objectIDs
        } catch (err) {
            console.error('Failed to fetch artworks:', err);
            setError('Failed to load artworks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Check if all artworks have been found
    useEffect(() => {
        if (artworks.length > 0 && artworks.every(art => art.found)) {
            console.log("All artworks have been found!"); // Optional action when all artworks are found
            // handleGenerateHunt(); // Uncomment to regenerate the hunt automatically
        }
    }, [artworks]);

    return (
        <div>
            <h1>Scavenger Hunt</h1>
            <p>Explore the Met. A selection of artworks will be provided to you. Seek out the item and use the information provided on the object's Title Card to confirm you've located the artwork.</p>
            <button onClick={handleGenerateHunt} className="generate-hunt-button">Generate Scavenger Hunt</button>
            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                <div className="save-artwork-list">
                    {artworks.map(art => (
                        <div key={art.objectID} className="save-artwork-item">
                            <div className="save-artwork-image-container">
                                <img src={art.primaryImageSmall} alt={art.title} className="save-artwork-image" />
                            </div>
                            <div className="save-artwork-info">
                                <h3 className="save-artwork-title">{art.title}</h3>
                                <p className="save-artwork-gallery">Gallery Number: {art.galleryNumber}</p>
                                <p>Artist: {art.artistDisplayName || 'Unknown'}</p>
                                <div className="question">
                                    <label htmlFor={`input-${art.objectID}`}>Enter the Artwork's ObjectID:</label>
                                    <input id={`input-${art.objectID}`} type="text" onChange={() => markAsFound(art.objectID)} />
                                </div>
                                <button onClick={() => markAsFound(art.objectID)} disabled={art.found}>
                                    Mark as Found
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
