import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtworksByGalleryNumber } from '../services/apiService';
import ArtworkActions from './ArtworkActions';
import { useAuth } from '../contexts/AuthContext';
import '../Style/ArtworkList.css';

function ArtworkList({ galleryNumber }) {
    const { savedArtworks, fetchSavedArtworks } = useAuth();
    const navigate = useNavigate();
    const [artworks, setArtworks] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        if (galleryNumber) {
            setLoading(true);
            setError('');
            setIsVisible(true);

            getArtworksByGalleryNumber(galleryNumber)
                .then(data => {
                    console.log("Fetched artworks:", data);  // Detailed log of fetched data
                    if (data.length > 0) {
                        const filteredArtworks = data.filter(artwork => artwork.primaryImageSmall !== "");
                        setArtworks(filteredArtworks);
                        console.log("Filtered artworks:", filteredArtworks);  // Log filtered artworks
                    } else {
                        setError('No artworks to display.');
                        setIsVisible(false);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching artworks:', error);
                    setError('Failed to fetch artworks');
                    setIsVisible(false);
                    setLoading(false);
                });
        } else {
            setIsVisible(false);
        }
    }, [galleryNumber]);

    const handleClose = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                handleClose(); 
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    const viewArtworkDetail = (artwork) => {
        navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
    };

    // Function to check if artwork is saved
    const isArtworkSaved = (artworkId) => {
        // console.log('Checking if artwork is saved:', artworkId, savedArtworks);
        return savedArtworks.some(art => art.objectID === artworkId && art.isActive);
    };

    // Function to update the state after save/remove action
    const updateArtworkStatus = (artworkId, isActive) => {
        setArtworks(prevArtworks => prevArtworks.map(art =>
            art.objectID === artworkId ? { ...art, isActive } : art
        ));
        fetchSavedArtworks();  // Fetch the updated saved artworks list
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div ref={containerRef} className={`artwork-list-container ${isVisible ? 'showArt' : 'hideArt'}`}>
            <div className="button-container">
                <button className="close-button" onClick={handleClose}></button>
            </div>
            {loading ? (
                <p>Loading artworks...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                artworks.map(artwork => (
                    <div key={`artwork-${artwork.objectID}`} className="artwork-item">
                        <div className="artwork-image-container" onClick={() => viewArtworkDetail(artwork)}>
                            <img src={artwork.primaryImageSmall} alt={artwork.title} className="artwork-image" />
                        </div>
                        <div className="artwork-details">
                            <ArtworkActions artwork={artwork} onStatusChange={updateArtworkStatus} isActive={isArtworkSaved(artwork.objectID)} />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ArtworkList;
