import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addArtworkToCollection, addCollection } from '../services/apiService';
import '../Style/ManageCollections.css';

const ManageCollections = ({ artwork, onClose }) => {
    const { user, collections, handleGetCollections, saveArtworkContext } = useAuth();
    const [newCollectionName, setNewCollectionName] = useState('');
    const [addedCollectionIds, setAddedCollectionIds] = useState(new Set());
    
    // Troubleshooting state 
    const [selectedCollectionId, setSelectedCollectionId] = useState('');

    const handleAddToCollection = async (collectionId) => {
        const collection = collections.find(c => c.id === parseInt(collectionId));
        if (!collection) {
            console.error('No collection found with the selected ID.');
            return;
        }

        try {
            await addArtworkToCollection(collection.name, artwork.objectID, user.id);
            saveArtworkContext({ objectID: artwork.objectID, galleryNumber: artwork.galleryNumber });
            // Mark as added
            setAddedCollectionIds(prev => new Set(prev.add(collectionId))); 
            // Refresh collections list
            handleGetCollections(user.id); 
        } catch (error) {
            console.error('Failed to add artwork to collection:', error);
        }
    };

    const handleCreateAndAddToCollection = async () => {
        if (!newCollectionName.trim()) {
            console.log('Please enter a name for the new collection.');
            return;
        }

        try {
            const newCollection = await addCollection({ name: newCollectionName, user_id: user.id });
            await addArtworkToCollection(newCollection.name, artwork.objectID, user.id);
            saveArtworkContext({ objectID: artwork.objectID, galleryNumber: artwork.galleryNumber });
            setNewCollectionName('');
            handleGetCollections(user.id);  
            onClose(); 
        } catch (error) {
            console.error('Failed to create collection and add artwork:', error);
        }
    };

    return (
        <div className="manage-collections-modal" onClick={onClose}>
            <div className="manage-collections-content" onClick={e => e.stopPropagation()}>
                <h2>Manage Collections</h2>
                <div className='newCollection'>
                    <input type="text" value={newCollectionName} onChange={e => setNewCollectionName(e.target.value)} placeholder="New collection name" />
                    <button onClick={handleCreateAndAddToCollection} disabled={!newCollectionName.trim()}>Create and Add to New Collection</button>
                </div>
                <ul>
                    {collections.map(collection => (
                        <li key={collection.id}>
                            {collection.name}
                            <button onClick={() => handleAddToCollection(collection.id)} className="add-button">
                                {addedCollectionIds.has(collection.id) ? 'ADDED' : <img src="/src/buttons/add.png" alt="Add" />}
                            </button>
                        </li>
                    ))}
                </ul>
                <button onClick={onClose} className="close-collection-button"></button>
            </div>
        </div>
    );
};

export default ManageCollections;
