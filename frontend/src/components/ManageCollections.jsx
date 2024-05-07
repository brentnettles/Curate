import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addArtworkToCollection, addCollection } from '../services/apiService';
import '../Style/ManageCollections.css';

const ManageCollections = ({ artwork, onClose }) => {
    const { user, collections, handleGetCollections, saveArtworkContext } = useAuth();
    const [newCollectionName, setNewCollectionName] = useState('');
    const [selectedCollectionId, setSelectedCollectionId] = useState('');

    const handleAddToCollection = async () => {
        console.log("Selected Collection ID: ", selectedCollectionId);
        console.log("Artwork ID to add: ", artwork.objectID); // Verify that this ID is correct
        if (selectedCollectionId && artwork.objectID) {
            const collection = collections.find(c => c.id === parseInt(selectedCollectionId));
            if (collection) {
                try {
                    await addArtworkToCollection(collection.name, artwork.objectID, user.id);
                    saveArtworkContext({ objectID: artwork.objectID, galleryNumber: artwork.galleryNumber }); // Update local state to reflect saved status
                    console.log('Artwork added to collection successfully.');
                    onClose();
                    handleGetCollections(user.id);
                } catch (error) {
                    console.error('Failed to add artwork to collection:', error);
                    console.log('Failed to add artwork to collection: ' + error.message);
                }
            } else {
                console.log('No collection found with the selected ID.');
            }
        } else {
            console.log('Please select a collection and ensure artwork is valid.');
        }
    };

    //Create a new collection WAIT then add artwork 
    //Update the state 
    const handleCreateAndAddToCollection = async () => {
        if (!newCollectionName.trim()) {
            console.log('Please enter a name for the new collection.');
            return;
        }
    
        try {
            console.log('Creating new collection with name:', newCollectionName, 'for user:', user.id);
            // Create new collection
            const collectionData = {
                name: newCollectionName,
                user_id: user.id
            };
            const newCollectionResponse = await addCollection(collectionData);
            if (!newCollectionResponse.ok) {
                const errorText = await newCollectionResponse.text();
                console.error('API response error:', errorText);
                throw new Error('Failed to create collection: ' + errorText);
            }
            const newCollection = await newCollectionResponse.json();
            console.log('New collection created:', newCollection);
    

            const collectionName = newCollection.collection.name; 
            console.log('Adding artwork to collection:', collectionName, 'Artwork ID:', artwork.objectID);
            await addArtworkToCollection(collectionName, artwork.objectID, user.id);
             // Update state to reflect saved status
            saveArtworkContext({ objectID: artwork.objectID, galleryNumber: artwork.galleryNumber }); 
            console.log('Collection created and artwork added successfully.');
            setNewCollectionName('');
            handleGetCollections(user.id);  
        } catch (error) {
            console.error('Failed at add artwork:');

        }
    };
    
    

    return (
        <div className="manage-collections-modal" onClick={onClose}>
            <div className="manage-collections-content" onClick={e => e.stopPropagation()}>
                <h2>Manage Collections</h2>
                <div className='newCollection'>
                    <input type="text" value={newCollectionName} onChange={e => setNewCollectionName(e.target.value)} placeholder="New collection name" />
                    <button onClick={handleAddToCollection}>Add to Collection</button>
                    <button onClick={handleCreateAndAddToCollection} disabled={!newCollectionName.trim()}>Create and Add to New Collection</button>


                </div>
                <select onChange={e => setSelectedCollectionId(e.target.value)} value={selectedCollectionId}>
                    <option value="">Select a Collection</option>
                    {collections.map((collection) => (
                        <option key={collection.id} value={collection.id}>{collection.name}</option>
                    ))}
                </select>
                <button onClick={onClose} className="close-collection-button">Close</button>
            </div>
        </div>
    );
};

export default ManageCollections;
