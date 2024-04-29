import React, { useEffect, useState } from 'react';
import './ArtworkList.css';
import ArtworkList from './ArtworkList';

function ArtworkDisplay({ galleryNumber }) {
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const response = await fetch(`http://127.0.0.1:5555/api/artworks/${galleryNumber}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setArtworks(data.filter(artwork => artwork.primaryImageSmall !== ""));
        setIsVisible(data.length > 0);
      } catch (error) {
        console.error('Error fetching artworks:', error);
        setError(error.message);
        setArtworks([]);  
      }
    }

    if (galleryNumber) {
      fetchArtworks();
      // console.log(artworks)

    }
  }, [galleryNumber]);

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div className="artwork-display-container">
      <div className="navigation-arrows">
        {/* Navigation arrows can be added here */}
      </div>
      <ArtworkList artworks={artworks} isVisible={isVisible} onClose={() => setIsVisible(false)} />
    </div>
  );
}

export default ArtworkDisplay;



  // useEffect(() => {
  //   const handleOutsideClick = (event) => {
  //     if (displayRef.current && !displayRef.current.contains(event.target)) {
  //       setIsVisible(false); // Modify this logic if it's too aggressive
  //     }
  //   };
  
  //   document.addEventListener('mousedown', handleOutsideClick);
  //   return () => {
  //     document.removeEventListener('mousedown', handleOutsideClick);
  //   };
  // }, []);

//   if (error) {
//     return <div>Error fetching data: {error}</div>;
//   }

//   return (
//     <div>
//     {/* // <div ref={displayRef} className="artwork-display-container" onClick={(e) => e.stopPropagation()}> */}
//         <div className="navigation-arrows">
//             {/* Navigation arrows can be added here */}
//         </div>
//         <div className="artwork-list">
//             {/* <h2>Artworks for Gallery {galleryNumber}</h2> */}
//             <ArtworkList artworks={artworks} isVisible={isVisible} onClose={() => setIsVisible(false)} />
//         </div>
//     </div>
//   );
// }

// export default ArtworkDisplay;
