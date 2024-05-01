import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ArtworkActions from './ArtworkActions';
import '../Style/UserPage.css'; // Make sure the path is correct

function UserPage() {
    const [artworks, setArtworks] = useState([]);
    const [newCollectionName, setNewCollectionName] = useState('');
    const { user, collections, addToCollection } = useAuth();
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

    const handleAddToCollection = (artworkId) => {
        if (newCollectionName.trim() !== '') {
            addToCollection(artworkId, newCollectionName);
            setNewCollectionName('');
        }
    };

    const truncateTitle = (title) => {
        return title.length > 50 ? title.substring(0, 50) + '...' : title;
    };

    return (
        <div>
            <h1>Saved Artworks</h1>
            <input
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="New or existing collection name"
            />
            <div className="save-artwork-list">
                {artworks.map(artwork => (
                    <div key={artwork.objectID} className="save-artwork-item">
                        <img src={artwork.primaryImageSmall} alt={artwork.title} onClick={() => navigate(`/artwork/${artwork.objectID}`)} className="save-artwork-image"/>
                        <div className="save-artwork-info">
                            <h3>{truncateTitle(artwork.title)}</h3>
                            <p>Gallery: {artwork.galleryNumber}</p>
                            <button onClick={() => handleAddToCollection(artwork.objectID)}>Add to Collection</button>
                            <ArtworkActions artwork={artwork} onActionComplete={() => setArtworks(current => current.filter(a => a.objectID !== artwork.objectID))} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserPage;
