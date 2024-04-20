import React, { useEffect, useState } from 'react';

function ArtworkDisplay({ galleryNumber }) {
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      if (!galleryNumber) {
        console.log('Gallery number is undefined, not fetching.');
        return; // Check if galleryNumber is undefined and abort if true
      }

      try {
        const response = await fetch(`/api/artworks/${galleryNumber}`, {
          method: 'GET',
          credentials: 'include',  // Ensure cookies are sent with requests
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArtworks(data);
        console.log('Fetched data:', data);  // Log data to console for debugging
      } catch (error) {
        console.error('Error fetching artworks:', error);
        setError(error.message);
      }
    };

    fetchArtworks();
  }, [galleryNumber]); // Dependency array ensures fetch is called when galleryNumber updates

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div>
      <h2>Artworks for Gallery {galleryNumber}</h2>
      {artworks.map(artwork => (
        <div key={artwork.objectID}>
          <p>{artwork.title}</p>
          <img src={artwork.primaryImage} alt={artwork.title} />
        </div>
      ))}
    </div>
  );
}

export default ArtworkDisplay;
