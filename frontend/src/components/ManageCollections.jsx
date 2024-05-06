





import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addArtworkToCollection, addCollection, markArtworkAsInactive } from '../services/apiService';
import '../Style/ManageCollections.css';

const ManageCollections = ({ artwork, onClose }) => {
    const { user, collections, handleGetCollections, toggleCollectionVisibility, toggleStates, setToggleStates } = useAuth();
    const [newCollectionName, setNewCollectionName] = useState('');
    const [selectedCollection, setSelectedCollection] = useState(null);

// Adjust how you set the selected collection in the dropdown
    const handleCollectionSelect = (e) => {
    const selectedId = e.target.value;
    const collection = collections.find(c => c.id === selectedId);
    setSelectedCollection(collection || null);
};

    const handleAddToCollection = async () => {
        if (selectedCollection) {
            console.log(`Attempting to add artwork to collection: Collection Name ${selectedCollection.name}, Artwork ID ${artwork.objectID}`);
            try {
                await addArtworkToCollection(selectedCollection.name, artwork.objectID, user.id);
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
                    user_id: user.id
                };
                const response = await addCollection(collectionData);
                const newCollection = await response.json();

                if (newCollection && newCollection.id) {
                    console.log(`New collection created: ${newCollection.id}, adding artwork...`);
                    await addArtworkToCollection(newCollection.id, artwork.objectID, user.id);
                    alert('Collection created and artwork added successfully.');
                    setNewCollectionName('');
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

    // toggle + / - for add/remove artwork to/from collection
    const handleToggleCollectionVisibility = async (collectionId) => {
        console.log(`Toggling visibility for collection ID: ${collectionId} with artwork ID: ${artwork.objectID}`);
        const isActive = toggleStates[collectionId];
        console.log(`Current active state: ${isActive}`);
        setToggleStates(prev => ({ ...prev, [collectionId]: !isActive }));
    
        const collection = collections.find(col => col.id === collectionId);
        if (!collection) {
            console.error("Collection not found");
            return;
        }
    
        if (!isActive) {
            console.log(`Activating artwork in collection: ${collection.name}`);
            try {
                await addArtworkToCollection(collection.name, artwork.objectID, user.id);
                console.log('Artwork added to collection successfully.');
            } catch (error) {
                console.error('Error adding artwork to collection:', error);
            }
        } else {
            console.log(`Deactivating artwork: ${artwork.objectID} in collection: ${collection.name}`);
            try {
                await markArtworkAsInactive(artwork.objectID, user.id);
                console.log('Artwork marked as inactive');
            } catch (error) {
                console.error('Error marking artwork as inactive:', error);
            }
        }
    };
    
    
    return (
        <div className="manage-collections-modal" onClick={onClose}>
    <div className="manage-collections-content" onClick={e => e.stopPropagation()}>
        <h2>Manage Collections</h2>
        <div className='newCollection'>
            <input type="text" value={newCollectionName} onChange={e => setNewCollectionName(e.target.value)} placeholder="New collection name" />
            <button onClick={handleCreateAndAddToCollection}>Create and Add</button>
        </div>
        
            <button onClick={onClose} className="close-collection-button"></button> {/* Make sure this is properly closed */}
        <div className="collection-list">
            {collections.map(collection => (
                <div key={collection.id} className="collection-item">
                    {collection.name}
                    <button className="toggle-button" onClick={() => handleToggleCollectionVisibility(collection.id)}>
                        {toggleStates[collection.id] ? '-' : '+'}
                    </button>
                </div>
            ))}
        </div>
    </div>
</div>

    );
    
};

export default ManageCollections;
