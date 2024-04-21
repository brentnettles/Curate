import React, { useEffect, useState } from 'react';
import './ArtworkList.css'; // Import CSS file
import ArtworkList from './ArtworkList'; // Import ArtworkList component

function ArtworkDisplay({ galleryNumber }) {
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // State to track visibility of ArtworkList

  useEffect(() => {
    async function fetchArtworks() {
      const url = `http://127.0.0.1:5555/api/artworks/${galleryNumber}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Artworks Data:", data);  // Log the fetched data
        const validArtworks = data.filter(artwork => artwork.primaryImageSmall !== ""); // Filter out artworks without primaryImageSmall
        setArtworks(validArtworks);
        setIsVisible(validArtworks.length > 0); // Set isVisible to true if there are valid artworks
      } catch (error) {
        console.error('Error fetching artworks:', error);
        setError(error.message);
      }
    }

    if (galleryNumber) {  // Ensure galleryNumber is not undefined or null
      fetchArtworks();
    }
  }, [galleryNumber]); // Dependency array ensures fetch is called when galleryNumber updates

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div className="artwork-display-container">
        <div className="navigation-arrows">
            {/* Navigation arrows can be added here */}
        </div>
        <div className="artwork-list">
            {/* <h2>Artworks for Gallery {galleryNumber}</h2> */}
            <ArtworkList artworks={artworks} isVisible={isVisible} /> {/* Pass isVisible prop */}
        </div>
    </div>
  );
}

export default ArtworkDisplay;
