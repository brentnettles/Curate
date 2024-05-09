import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchScavengerHunt, saveScavengerHuntAsCollection } from '../services/apiService';
import '../Style/Discover.css';

function Discover() {
    const { user } = useAuth();
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [allFound, setAllFound] = useState(false);
    const [buttonText, setButtonText] = useState('Save All as Collection');

    useEffect(() => {
        const savedHunt = localStorage.getItem('scavengerHunt');
        if (savedHunt) {
            const huntData = JSON.parse(savedHunt);
            setArtworks(huntData);
            setAllFound(huntData.every(art => art.found));
        }
    }, []);

    useEffect(() => {
        if (allFound) {
            window.scrollTo({ top: 0, behavior: 'smooth' });  // Smooth scroll to the top when all artworks are found
        }
    }, [allFound]); ; // Dependency on allFound to trigger scroll only when it changes to true

    const handleGenerateHunt = async () => {
        setLoading(true);
        try {
            const response = await fetchScavengerHunt();
            const data = response.artworks;
            const initializedArtworks = data.map(art => ({ ...art, found: false }));
            console.log("Fetched Artworks Data:", data);
            setArtworks(initializedArtworks);
            localStorage.setItem('scavengerHunt', JSON.stringify(initializedArtworks));
            setAllFound(false);
            setError('');
        } catch (err) {
            console.error('Failed to fetch artworks:', err);
            setError('Failed to load artworks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAsCollection = async () => {
        if (user && user.id) {
            const foundArtworks = artworks.filter(art => art.found).map(art => art.objectID);
            try {
                await saveScavengerHuntAsCollection(user.id, foundArtworks);
                setButtonText('NEW COLLECTION SAVED');
            } catch (error) {
                console.error('Failed to save collection:', error);
                setError('Failed to create collection!');
            }
        } else {
            setError('User must be logged in to save a collection.');
        }
    };

    const handleKeyDown = (e, artworkObjectID) => {
        if (e.key === 'Enter') {
            handleSubmitGuess(e.target.value, artworkObjectID);
        }
    };

    const handleSubmitGuess = async (userGuess, artworkObjectID) => {
        try {
            const response = await fetch('http://localhost:5555/api/verify-artwork', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userInputId: userGuess,
                    objectId: artworkObjectID
                })
            });
            const result = await response.json();
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
        const updatedArtworks = artworks.map(art =>
            art.objectID === objectID ? { ...art, found: true } : art
        );
        setArtworks(updatedArtworks);
        localStorage.setItem('scavengerHunt', JSON.stringify(updatedArtworks));
        setAllFound(updatedArtworks.every(art => art.found));
    };

    return (
        <div className='discover-container'>
            <h1 className='header'>Scavenger Hunt</h1>
            <p className='about'>Explore the Met. A selection of artworks will be provided to you. Seek out the item and use the information provided on the object's Title Card to confirm you've located the artwork.</p>
            <div className="button-row">
                <button onClick={handleGenerateHunt} disabled={loading} className="button-common generate-hunt-button">Generate Scavenger Hunt</button>
                {allFound && (
                    <button onClick={handleSaveAsCollection} className="button-common discover-collection-button">
                        {buttonText}  
                    </button>
                )}
            </div>
            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                <div className="discover-list">
                    {artworks.map(art => (
                        <div key={art.objectID} className="discover-artwork-item">
                            <div className="save-artwork-image-container">
                                <img src={art.primaryImageSmall} alt={art.title} className="discover-artwork-image" />
                            </div>
                            <div className="discover-artwork-info">
                                <h3 className="discover-artwork-title">{art.title}</h3>
                                <p className="discover-artwork-gallery">Gallery Number: {art.galleryNumber}</p>
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
        </div>
    );
}

export default Discover;