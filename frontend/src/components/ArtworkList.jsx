import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtworksByGalleryNumber } from '../services/apiService';
import ArtworkActions from './ArtworkActions';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import '../Style/ArtworkList.css';

function ArtworkList({ galleryNumber }) {
    const { savedArtworks } = useAuth(); // Use savedArtworks from context
    const navigate = useNavigate();
    const [artworks, setArtworks] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const viewArtworkDetail = (artwork) => {
        navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className={`artwork-list-container ${isVisible ? 'showArt' : 'hideArt'}`}>
            <div className="button-container">
                <button className="close-button" onClick={handleClose}>Close</button>
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
