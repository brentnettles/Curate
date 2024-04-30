import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { deleteArtwork } from '../services/apiService'; // Importing the deleteArtwork function

function UserPage() {
    const [artworks, setArtworks] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            alert('Please log in to view saved artworks.');
            return;
        }

        console.log("Fetching artworks for user:", user.username); // Log fetching
        fetch(`http://localhost:5555/api/user-artworks/${user.username}`)
            .then(response => response.json())
            .then(data => {
                console.log("Artworks loaded:", data.artworks); // Log loaded artworks
                if (data.artworks) {
                    setArtworks(data.artworks);
                }
            })
            .catch(error => console.error('Failed to fetch artworks:', error));
    }, [user]);

    const navigateToArtwork = (objectID) => {
        navigate(`/artwork/${objectID}`);
    };

    const removeArtwork = async (objectID) => {
        if (!user) return;
    
        console.log("Attempting to delete", objectID); // Ensure this logs the correct ID
        try {
            await deleteArtwork(objectID, user.id); // Pass objectID which should match the Flask route parameter
            setArtworks(currentArtworks => currentArtworks.filter(artwork => artwork.objectID !== objectID));
            console.log('Artwork removed successfully:', objectID);
        } catch (error) {
            console.error('Error removing artwork:', error);
        }
    };
    

    return (
        <div>
            <h1>Saved Artworks</h1>
            <div className="artwork-list">
                {artworks.map(artwork => (
                    <div key={artwork.objectID} className="artwork-item"> {/* Use objectID for key if unique */}
                        <img src={artwork.primaryImageSmall} alt={artwork.title} onClick={() => navigateToArtwork(artwork.objectID)} />
                        <h3>{artwork.title}</h3>
                        <p>Gallery: {artwork.galleryNumber}</p>
                        <button onClick={() => removeArtwork(artwork.objectID)}>Remove</button> {/* Pass objectID here */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserPage;


    // const removeArtwork = async (artworkId) => {
    //     if (!user) return;

    //     console.log("Deleting artwork with ID:", artworkId); // Log the ID 

    //     try {
    //         const response = await fetch(`http://localhost:5555/api/user-to-view/${artworkId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'User-ID': user.id  // Testing the User-ID header
    //             }
    //         });

    //         if (!response.ok) {
    //             const result = await response.json();
    //             throw new Error(result.error || 'Failed to remove artwork');
    //         }

    //         setArtworks(artworks.filter(artwork => artwork.id !== artworkId));
    //         console.log('Artwork removed successfully:', artworkId);
    //     } catch (error) {
    //         console.error('Error removing artwork:', error);
    //     }
    // };

