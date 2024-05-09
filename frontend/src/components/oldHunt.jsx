import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchScavengerHunt, saveScavengerHuntAsCollection } from '../services/apiService';


function Discover() {
    const { user } = useAuth(); // Use user from context
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [allFound, setAllFound] = useState(false);

    useEffect(() => {
        const savedHunt = localStorage.getItem('scavengerHunt');
        if (savedHunt) {
            const huntData = JSON.parse(savedHunt);
            setArtworks(huntData);
            setAllFound(huntData.every(art => art.found));
        }
    }, []);

    const handleGenerateHunt = async () => {
        setLoading(true);
        try {
            const response = await fetchScavengerHunt();
            const data = response.artworks;
            const initializedArtworks = data.map(art => ({ ...art, found: false }));
            setArtworks(initializedArtworks);
            localStorage.setItem('scavengerHunt', JSON.stringify(initializedArtworks)); // Save to localStorage
            setAllFound(false);
            setError('');
            console.log("Scavenger Hunt artworks loaded:", initializedArtworks.map(art => ({
                objectID: art.objectID, 
                title: art.title, 
                found: art.found 
            })));
        } catch (err) {
            console.error('Failed to fetch artworks:', err);
            setError('Failed to load artworks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e, artworkObjectID) => {
        if (e.key === 'Enter') {
            handleSubmitGuess(e.target.value, artworkObjectID);
        }
    };

    const handleSubmitGuess = async (userGuess, artworkObjectID) => {
        console.log("Submitting guess:", userGuess, "for artwork ID:", artworkObjectID);  // Debug log
        try {
            const response = await fetch('http://localhost:5555/api/verify-artwork', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userInputId: userGuess, // Ensure this matches the server's expected key
                    objectId: artworkObjectID  // Ensure this matches the server's expected key
                })
            });
            const result = await response.json();
            console.log("Server response:", result);  // Debug log
            if (response.ok && result.found) {

                markAsFound(artworkObjectID);
            } else {
                throw new Error(result.error || "Failed to verify the artwork.");
            }
        } catch (error) {
            console.error('Error verifying artwork:', error);

        }
    };

    const markAsFound = (objectID) => {
        setArtworks(prevArtworks =>
            prevArtworks.map(art => 
                art.objectID === objectID ? { ...art, found: true } : art
            )
        );
        const updatedArtworks = artworks.map(art =>
            art.objectID === objectID ? { ...art, found: true } : art
        );
        localStorage.setItem('scavengerHunt', JSON.stringify(updatedArtworks)); // Update localStorage
        setAllFound(updatedArtworks.every(art => art.found));
    };

    const handleSaveAsCollection = async () => {
        setLoading(true);
        const artworkIds = artworks.filter(art => art.found).map(art => art.objectID);
        try {
            await saveScavengerHuntAsCollection(user.id, artworkIds);
            alert('Collection saved successfully!');
            // Optionally reset the hunt or redirect the user
        } catch (error) {
            console.error('Failed to save collection:', error);
            alert('Failed to save collection. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Scavenger Hunt</h1>
            <p>Explore the Met. A selection of artworks will be provided to you. Seek out the item and use the information provided on the object's Title Card to confirm you've located the artwork.</p>
            <button onClick={handleGenerateHunt} disabled={loading} className="generate-hunt-button">Generate Scavenger Hunt</button>
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
                                {!art.found && (
                                    <div className="question">
                                        <label htmlFor={`input-${art.objectID}`}>Enter the Artwork's ObjectID:</label>
                                        <input 
                                            id={`input-${art.objectID}`} 
                                            type="text" 
                                            onKeyDown={(e) => handleKeyDown(e, art.objectID)}
                                        />
                                        <button onClick={() => handleSubmitGuess(document.getElementById(`input-${art.objectID}`).value, art.objectID)}>
                                            Submit
                                        </button>
                                    </div>
                                )}
                                {art.found && <span>Found!</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {allFound && (
                <button onClick={handleSaveAsCollection} className="save-collection-button">
                    Save All as Collection
                </button>
            )}
        </div>
    );
}

export default Discover;
