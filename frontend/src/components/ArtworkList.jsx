import './ArtworkList.css';
import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


function ArtworkList({ artworks, isVisible, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const artworkListRef = useRef(null);

  const viewArtworkDetail = (artwork) => {
    // Navigate with state
    navigate(`/artwork/${artwork.objectID}`, { state: { artwork } });
  };

  const saveArtwork = async (artwork, event) => {
    event.stopPropagation(); // Stops change when clicking on the 'Save' button

    if (!user) {
      alert("Please log in to save artworks.");
      return;
    }

    const postData = {
      username: user.username, 
      objectID: artwork.objectID,
      galleryNumber: artwork.galleryNumber 
    };

    console.log("Sending POST request with data:", postData); 

    try {
      const response = await fetch(`http://127.0.0.1:5555/api/user-to-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });

      const responseData = await response.json();  
      console.log("Server response:", responseData); 

      if (!response.ok) {
        throw new Error(`Failed to save artwork: ${response.statusText}`);
      }
      // alert("Artwork saved successfully!");
    } catch (error) {
      console.error('Error saving artwork:', error);
      // alert("Failed to save artwork. Check console for details.");
    }
  };

  return (
    <div ref={artworkListRef} className={`artwork-list-container ${isVisible ? 'showArt' : 'hideArt'}`}>
      {artworks.map(artwork => (
        <div key={artwork.objectID} className="artwork-item" onClick={() => viewArtworkDetail(artwork)}>
          <img src={artwork.primaryImageSmall} alt={artwork.title} className="artwork-image" />
          <button onClick={(e) => saveArtwork(artwork, e)}>Save</button>  
        </div>
      ))}
    </div>
  );
}

export default ArtworkList;
