import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addArtworkToCollection, addCollection } from '../services/apiService';

const ManageCollections = ({ artwork, onClose }) => {
    const { user, collections, handleGetCollections } = useAuth();
    const [newCollectionName, setNewCollectionName] = useState('');
    const [selectedCollectionId, setSelectedCollectionId] = useState('');

    useEffect(() => {
        if (user) {
            handleGetCollections(user.id);
        }
    }, [user, handleGetCollections]);

    const handleAddToCollection = async () => {
        if (selectedCollectionId) {
            console.log(`Attempting to add artwork to collection: Collection ID ${selectedCollectionId}, Artwork ID ${artwork.objectID}`);
            try {
                await addArtworkToCollection(selectedCollectionId, artwork);
                alert('Artwork added to collection successfully.');
                onClose();
            } catch (error) {
                console.error('Failed to add artwork to collection:', error);
                alert('Failed to add artwork to collection.');
            }
        } else {
            alert('Please select a collection.');
        }
    };

    const handleCreateAndAddToCollection = async () => {
        if (newCollectionName) {
            console.log(`Attempting to create a new collection: ${newCollectionName}, User ID: ${user.id}`);
            try {
                const collectionData = {
                    name: newCollectionName,
                    user_id: user.id,
                    artwork_objectID: artwork.objectID
                };
                const response = await addCollection(collectionData);
                const newCollection = await response.json(); // Now calling .json() here
    
                if (newCollection && newCollection.id) {
                    console.log(`New collection created: ${newCollection.id}, adding artwork...`);
                    await addArtworkToCollection(newCollection.id, artwork);
                    alert('Collection created and artwork added successfully.');
                    setNewCollectionName(''); // Reset input field
                    onClose();
                } else {
                    alert('Failed to retrieve new collection ID.');
                }
            } catch (error) {
                console.error('Failed to create collection and add artwork:', error);
                alert('Failed to create collection and add artwork.');
            }
        } else {
            alert('Please enter a name for the new collection.');
        }
    };
    
    

    return (
        <div className="manage-collections-modal">
            <h2>Manage Collections</h2>
            <div>
                <select value={selectedCollectionId} onChange={e => setSelectedCollectionId(e.target.value)}>
                    <option value="">Select a collection</option>
                    {collections.map(collection => (
                        <option key={collection.id} value={collection.id}>{collection.name}</option>
                    ))}
                </select>
                <button onClick={handleAddToCollection}>Add to Collection</button>
            </div>
            <div>
                <input
                    type="text"
                    value={newCollectionName}
                    onChange={e => setNewCollectionName(e.target.value)}
                    placeholder="New collection name"
                />
                <button onClick={handleCreateAndAddToCollection}>Create and Add</button>
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default ManageCollections;
