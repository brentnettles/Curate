import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  

function UserPage() {
    const [artworks, setArtworks] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            alert('Please log in to view saved artworks.');
            return;
        }

        fetch(`http://localhost:5555/api/user-artworks/${user.username}`)
            .then(response => response.json())
            .then(data => {
                if (data.artworks) {
                    setArtworks(data.artworks);
                }
            })
            .catch(error => console.error('Failed to fetch artworks:', error));
    }, [user]);

    const navigateToArtwork = (artworkId) => {
        navigate(`/artwork/${artworkId}`);
    };
    //Endpoint still TBD
    const removeArtwork = async (artworkId) => {
      if (!user) return;
  
      try {
          const response = await fetch(`http://localhost:5555/api/user-to-view/${artworkId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',

              },
              credentials: 'include' 
          });
  
          if (!response.ok) {
              const result = await response.json();
              throw new Error(result.error || 'Failed to remove artwork');
          }
  
          setArtworks(artworks.filter(artwork => artwork.objectID !== artworkId));
          alert('Artwork removed successfully');
      } catch (error) {
          console.error('Error removing artwork:', error);
          alert(error.message);
      }
  };
  

    return (
        <div>
            <h1>Saved Artworks</h1>
            <div className="artwork-list">
                {artworks.map(artwork => (
                    <div key={artwork.objectID} className="artwork-item">
                        <h3>{artwork.title}</h3>
                        <img src={artwork.primaryImageSmall} alt={artwork.title} onClick={() => navigateToArtwork(artwork.objectID)} />
                        <p>Gallery: {artwork.galleryNumber}</p>
                        <button onClick={() => removeArtwork(artwork.objectID)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserPage;
