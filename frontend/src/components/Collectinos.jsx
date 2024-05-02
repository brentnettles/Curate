import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Button to add an artwork to a collection in ArtworkActions / Rendered in UserPage


function Collections({ artworkId }) {
    const { collections, addArtworkToCollection, createCollection } = useContext(AuthContext);
    const [newCollectionName, setNewCollectionName] = useState('');

    // const handleCreateAndAdd = () => {
    //     if (newCollectionName.trim() !== '') {
    //         createCollection(newCollectionName);
    //         addArtworkToCollection(artworkId, newCollectionName);
    //         setNewCollectionName('');
    //     }
    // };

    return (
        <div>
            <input
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="New or existing collection name"
            />
            <button onClick={handleCreateAndAdd}> + New Collection</button>
            <ul>
                {collections.map(collection => (
                    <li key={collection.name}>
                        {collection.name}
                        <button onClick={() => addArtworkToCollection(artworkId, collection.name)}>
                            Add
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Collections;
