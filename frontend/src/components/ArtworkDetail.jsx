import '../Style/ArtworkDetail.css';
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import backIcon from '../buttons/left.png'; 

function ArtworkDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { artwork } = location.state || {};

  if (!artwork) {
    return <div>No artwork data available.</div>;
  }


  const additionalImages = Array.isArray(artwork.additionalImages) ? artwork.additionalImages : JSON.parse(artwork.additionalImages || '[]');

  // State to manage the displayed primary image
  const [currentPrimaryImage, setCurrentPrimaryImage] = useState(artwork.primaryImage);

  const handleImageClick = (image) => {
    setCurrentPrimaryImage(image);
  };

  return (
    <div className="artwork-detail">
      <div className="artwork-images">
        <div className="artwork-main-image" style={{ position: 'relative', height: '65vh' }}>
          <button className="back-button" onClick={() => navigate(-1)} style={{
            position: 'absolute', 
            left: '10px', 
            top: '10px', 
            backgroundImage: `url(${backIcon})`,
            backgroundSize: 'cover'
          }}>

          </button>
          <img src={currentPrimaryImage} alt={artwork.title} className="artwork-detail-image"/>
        </div>
        <div className="artwork-additional-images">
          {additionalImages.map((image, index) => (
            <img key={index} src={image} alt={`Additional view ${index + 1}`} className="artwork-additional-image" onClick={() => handleImageClick(image)} />
          ))}
        </div>
      </div>
      <div className="artwork-info">
        <h2>{artwork.title}</h2>
        <p><strong>Department:</strong> {artwork.department}</p>
        <p><strong>Title:</strong> {artwork.title}</p>
        <p><strong>Artist:</strong> {artwork.artistDisplayName}</p>
        <p><strong>Artist Bio:</strong> {artwork.artistDisplayBio}</p>
      </div>
    </div>
  );
}

export default ArtworkDetail;
 