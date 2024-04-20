import React, { useEffect, useState } from 'react';

function ArtworkDisplay({ galleryNumber }) {
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArtworks() {
      const url = `http://127.0.0.1:5555/api/artworks/${galleryNumber}`;  // Construct the URL with the gallery number

      try {
        // Include credentials with the fetch request
        const response = await fetch(url, { 
          credentials: 'include'  // Needed for cookies to be sent with CORS requests
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);  // Check if the response was successful
        }
        const data = await response.json();  // Parse JSON response
        console.log("Fetched Artworks Data:", data); // Log the fetched artworks data
        setArtworks(data);  // Set the artworks state
      } catch (error) {
        console.error('Error fetching artworks:', error);
        setError(error.message);  // Set the error state
      }
    }

    fetchArtworks();  // Call the fetch function
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
