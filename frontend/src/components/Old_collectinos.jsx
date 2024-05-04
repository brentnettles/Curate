// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import ArtworkActions from './ArtworkActions';
// import ScavengerHunt from './Hunt'; // Corrected import
// import '../Style/CollectionsPage.css';  // Updated CSS file

// function CollectionsPage() {
//     const [artworks, setArtworks] = useState([]);
//     const [selectedCollection, setSelectedCollection] = useState('All');
//     const { user, collections } = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!user) {
//             alert('Please log in to view saved artworks.');
//             navigate('/login');
//             return;
//         }

//         fetch(`http://localhost:5555/api/user-artworks/${user.username}`)
//             .then(response => response.json())
//             .then(data => {
//                 if (data.artworks) {
//                     setArtworks(data.artworks);
//                 }
//             })
//             .catch(error => console.error('Failed to fetch artworks:', error));
//     }, [user, navigate]);

//     const handleSelectCollection = (collectionName) => {
//         setSelectedCollection(collectionName);
//     };

//     return (
//         <div>
//             <h1>Collections</h1>
//             <div>
//                 <select onChange={(e) => handleSelectCollection(e.target.value)}>
//                     <option value="All">All Saved Artworks</option>
//                     {collections.map(col => (
//                         <option key={col.name} value={col.name}>{col.name}</option>
//                     ))}
//                 </select>
//             </div>
//             {selectedCollection === 'All' && (
//                 <div className="save-artwork-list">
//                     {artworks.map(artwork => (
//                         <div key={artwork.objectID} className="save-artwork-item">
//                             <img src={artwork.primaryImageSmall} alt={artwork.title} onClick={() => navigate(`/artwork/${artwork.objectID}`)} className="save-artwork-image"/>
//                             <div className="save-artwork-info">
//                                 <h3>{artwork.title}</h3>
//                                 <h3>Gallery: {artwork.galleryNumber}</h3>
//                                 <ArtworkActions artwork={artwork} onActionComplete={() => setArtworks(current => current.filter(a => a.objectID !== artwork.objectID))} />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//             {selectedCollection !== 'All' && (
//                 <div className="save-artwork-list">
//                     {artworks.filter(art => art.collectionName === selectedCollection).map(artwork => (
//                         <div key={artwork.objectID} className="save-artwork-item">
//                             {/* Similar layout as above */}
//                         </div>
//                     ))}
//                 </div>
//             )}
//             {selectedCollection === 'Scavenger Hunt' && <ScavengerHunt />}
//         </div>
//     );
// }

// export default CollectionsPage;
