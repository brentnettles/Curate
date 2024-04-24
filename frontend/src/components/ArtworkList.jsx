import './ArtworkList.css';
import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Make sure this import path is correct

function ArtworkList({ artworks, isVisible, onClose }) {
  const { user } = useAuth();  // Using the useAuth hook to access the user
  const artworkListRef = useRef(null);

  const saveArtwork = async (artwork) => {
    if (!user) {
      alert("Please log in to save artworks.");
      return;
    }

    const postData = {
      username: user.username, 
      objectID: artwork.objectID,
      galleryNumber: artwork.galleryNumber // Using gallery number from artwork
    };

    console.log("Sending POST request with data:", postData);  // Log the data being sent

    try {
      const response = await fetch(`http://127.0.0.1:5555/api/user-to-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });

      const responseData = await response.json();  // Assuming server sends back JSON
      console.log("Server response:", responseData);  // Log the server response

      if (!response.ok) {
        throw new Error(`Failed to save artwork: ${response.statusText}`);
      }
      alert("Artwork saved successfully!");
    } catch (error) {
      console.error('Error saving artwork:', error);
      alert("Failed to save artwork. Check console for details.");
    }
  };

  return (
    <div ref={artworkListRef} className={`artwork-list-container ${isVisible ? 'showArt' : 'hideArt'}`}>
      {artworks.map(artwork => (
        <div key={artwork.objectID} className="artwork-item">
          <img src={artwork.primaryImageSmall} alt={artwork.title} className="artwork-image" />
          <button onClick={() => saveArtwork(artwork)}>Save</button>  // Pass the whole artwork object
        </div>
      ))}
    </div>
  );
}

export default ArtworkList;
