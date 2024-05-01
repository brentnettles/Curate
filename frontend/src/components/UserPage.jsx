import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { deleteArtwork } from '../services/apiService'; // Importing the deleteArtwork function
import '../Style/UserPage.css'; 

function UserPage() {
    const [artworks, setArtworks] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            alert('Please log in to view saved artworks.');
            return;
        }

        console.log("Fetching artworks for user:", user.username);
        fetch(`http://localhost:5555/api/user-artworks/${user.username}`)
            .then(response => response.json())
            .then(data => {
                console.log("Artworks loaded:", data.artworks);
                if (data.artworks) {
                    setArtworks(data.artworks);
                }
            })
            .catch(error => console.error('Failed to fetch artworks:', error));
    }, [user]);

    const navigateToArtwork = (objectID) => {
        navigate(`/artwork/${objectID}`);
    };

    const navigateToGallery = (galleryNumber) => {
        navigate(`/gallery/${galleryNumber}`);
    };

    const removeArtwork = async (objectID) => {
        if (!user) return;

        console.log("Attempting to delete", objectID);
        try {
            await deleteArtwork(objectID, user.id);
            setArtworks(currentArtworks => currentArtworks.filter(artwork => artwork.objectID !== objectID));
            console.log('Artwork removed successfully:', objectID);
        } catch (error) {
            console.error('Error removing artwork:', error);
        }
    };

    return (
        <div>
            <h1>Saved Artworks</h1>
            <div className="save-artwork-list">
                {artworks.map(artwork => (
                    <div key={artwork.objectID} className="save-artwork-item">
                        <img src={artwork.primaryImageSmall} alt={artwork.title} onClick={() => navigateToArtwork(artwork.objectID)} className="save-artwork-image"/>
                        <div className="save-artwork-info">
                            <h3>{artwork.title}</h3>
                            <p>Gallery: {artwork.galleryNumber}</p>
                            <button onClick={() => navigateToGallery(artwork.galleryNumber)}>View Gallery</button>
                            <button onClick={() => navigateToArtwork(artwork.objectID)}>Inspect</button>
                            <button onClick={() => removeArtwork(artwork.objectID)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserPage;
