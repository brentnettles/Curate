import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtworksByGalleryNumber } from '../services/apiService';
import ArtworkActions from './ArtworkActions';
import { useAuth } from '../contexts/AuthContext';
import '../Style/ArtworkList.css';

function ArtworkList({ galleryNumber }) {
    const { savedArtworks } = useAuth();
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
                    if (data.length > 0) {
                        setArtworks(data.filter(artwork => artwork.primaryImageSmall !== ""));
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

    // Function to close the component
    const handleClose = () => {
        setIsVisible(false);
    };

    // Click outside handler / useEffect clutch 
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

    //onClick handler to view artwork details
    const viewArtworkDetail = (artwork) => {
        navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
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
                    <div key={artwork.objectID} className="artwork-item">
                        <div className="artwork-image-container" onClick={() => viewArtworkDetail(artwork)}>
                            <img src={artwork.primaryImageSmall} alt={artwork.title} className="artwork-image" />
                        </div>
                        <div className="artwork-details">
                            <ArtworkActions artwork={artwork} isActive={savedArtworks[artwork.objectID]?.isActive} />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ArtworkList;
