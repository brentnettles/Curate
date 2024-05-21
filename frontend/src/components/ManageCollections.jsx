import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addArtworkToCollection, addCollection } from '../services/apiService';
import '../Style/ManageCollections.css';

const ManageCollections = ({ artwork, onClose }) => {
    const { user, collections, fetchCollections, saveArtworkContext, savedArtworks, setCollections } = useAuth();
    const [newCollectionName, setNewCollectionName] = useState('');
    const [addedCollectionIds, setAddedCollectionIds] = useState(new Set());

    const handleAddToCollection = async (collectionId) => {
        const collection = collections.find(c => c.id === parseInt(collectionId));
        if (!collection) {
            console.error('No collection found with the selected ID.');
            return;
        }

        try {
            console.log('Adding artwork to collection:', collection.name);
            await addArtworkToCollection(collection.name, artwork.objectID, user.id);
            setAddedCollectionIds(prev => new Set(prev.add(collectionId)));
            await fetchCollections();
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
            // Step 1: Save the artwork if it's not already saved
            const isAlreadySaved = savedArtworks.some(art => art.objectID === artwork.objectID);
            if (!isAlreadySaved) {
                console.log('Saving artwork:', artwork);
                await saveArtworkContext({ objectID: artwork.objectID, galleryNumber: artwork.galleryNumber });
            }

            // Step 2: Create new collection
            console.log('Creating new collection with name:', newCollectionName);
            const response = await addCollection({ name: newCollectionName, user_id: user.id });
            const newCollection = await response.json();
            console.log('New collection created:', newCollection);

            // Make sure we correctly handle the structure of the new collection response
            const collectionName = newCollection.collection.name;

            setCollections(prev => [...prev, newCollection.collection]); // Add the new collection to the state

            // Step 3: Add artwork to the new collection
            console.log('Adding artwork to new collection with name:', collectionName);
            await addArtworkToCollection(collectionName, artwork.objectID, user.id);

            setNewCollectionName('');
            await fetchCollections();
            onClose();
        } catch (error) {
            console.error('Failed to create collection and add artwork:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCreateAndAddToCollection();
        }
    };

    return (
        <div className="manage-collections-modal" onClick={onClose}>
            <div className="manage-collections-content" onClick={e => e.stopPropagation()}>
                <h2>Manage Collections</h2>
                <div className='newCollection'>
                    <input
                        type="text"
                        value={newCollectionName}
                        onChange={e => setNewCollectionName(e.target.value)}
                        placeholder="New collection name"
                        onKeyDown={handleKeyPress}  // Handle enter key press
                    />
                    <button onClick={handleCreateAndAddToCollection} disabled={!newCollectionName.trim()}>
                        Create and Add to New Collection
                    </button>
                </div>
                <ul>
                    {collections.map(collection => (
                        <li key={`collection-${collection.id}`}>
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
