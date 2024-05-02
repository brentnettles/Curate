import React, { useState, useEffect } from 'react';
import '../Style/Scavenger.css';

function ScavengerHunt() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch('http://localhost:5555/api/scavenger-hunt');
        const data = await response.json();
        setArtworks(data);
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('Failed to fetch artworks:', err);
        setError('Failed to load artworks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <div className="artwork-list">
    {artworks.map(art => (
        <div key={art.objectID} className="artwork-item">
            <div className="artwork-details">
                <h3>{art.title}</h3>
                <p>Gallery Number: {art.galleryNumber}</p>
                <p>Artist: {art.artistDisplayName || 'Unknown'}</p>
                <div className="question">
                    <label htmlFor={`input-${art.objectID}`}>Enter the Artwork's ObjectID:</label>
                    <input id={`input-${art.objectID}`} type="text" />
                </div>
            </div>
            <div className="artwork-image-container">
                <img src={art.primaryImageSmall} alt={art.title} className="artwork-image" />
            </div>
        </div>
    ))}
</div>


  );
}

export default ScavengerHunt;
