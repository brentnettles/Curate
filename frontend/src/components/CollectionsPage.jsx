import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSavedArtworksByUserId, getCollectionsByUserId, getArtworkById } from '../services/apiService';
import ArtworkActions from './ArtworkActions';
import '../Style/CollectionsPage.css';

function CollectionsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [fetchedArtworks, setFetchedArtworks] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedCollectionId, setSelectedCollectionId] = useState('all');
    const [artworksDetails, setArtworksDetails] = useState([]);
    const [inactiveArtworks, setInactiveArtworks] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const artworks = await getSavedArtworksByUserId(user.id);
                const { collections } = await getCollectionsByUserId(user.id);
                setFetchedArtworks(artworks);
                setCollections(collections);
                setInactiveArtworks(artworks.filter(art => !art.isActive));
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [user, navigate]);

    useEffect(() => {
        const fetchArtworkDetails = async () => {
            if (selectedCollectionId !== 'all') {
                const selectedCollection = collections.find(c => c.id === parseInt(selectedCollectionId));
                if (selectedCollection && selectedCollection.artworks) {
                    const artworkPromises = selectedCollection.artworks.map(artwork =>
                        getArtworkById(artwork.artwork_objectID)
                    );
                    const artworks = await Promise.all(artworkPromises);
                    setArtworksDetails(artworks);
                }
            } else {
                setArtworksDetails(fetchedArtworks);
            }
        };

        fetchArtworkDetails();
    }, [selectedCollectionId, collections, fetchedArtworks]);

    return (
        <div className="collections-page">
            <select onChange={(e) => setSelectedCollectionId(e.target.value)} value={selectedCollectionId}>
                <option value="all">All Collections</option>
                {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>{collection.name}</option>
                ))}
            </select>
    
            <h1>{selectedCollectionId === 'all' ? 'All Artworks' : 'Filtered Artworks'}</h1>
            <div className="save-artwork-list">
                {artworksDetails.map((artwork, index) => (
                    <div key={artwork.objectID || index} className="save-artwork-item">
                        <img src={artwork.primaryImageSmall} alt={artwork.title} className="save-artwork-image" />
                        <div className="save-artwork-info">
                            <h3 className="save-artwork-title">{artwork.title}</h3>
                            <p className="save-artwork-gallery">Gallery: {artwork.galleryNumber}</p>
                            <div className="artwork-actions">
                                <ArtworkActions artwork={artwork} isActive={true} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2>Saved History</h2>
            <div className="saved-history">
                {inactiveArtworks.map((artwork, index) => (
                    <div key={artwork.objectID || index} className="save-artwork-item-history">
                        <img src={artwork.primaryImageSmall} alt={artwork.title} className="save-artwork-image" />
                        <div className="save-artwork-info">
                            <h3 className="save-artwork-title">{artwork.title}</h3>
                            <p className="save-artwork-gallery">Gallery: {artwork.galleryNumber}</p>
                            <div className="artwork-actions">
                                <ArtworkActions artwork={artwork} isActive={false} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CollectionsPage;
