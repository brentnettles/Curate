import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { addCollection } from '../services/apiService';

//Some redundant code checks here - troubleshooting keeping State in sync with local storage and backend

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [savedArtworks, setSavedArtworks] = useState(() => {
        // Parse the saved artworks as an array of objects
        const data = JSON.parse(localStorage.getItem('savedArtworks') || '[]');
        return new Set(data.map(item => ({ objectID: item.objectID, galleryNumber: item.galleryNumber })));
    });
    const [collections, setCollections] = useState(() => JSON.parse(localStorage.getItem('collections') || '[]'));

    //Buggy without the useEffect
    useEffect(() => {
        localStorage.setItem('savedArtworks', JSON.stringify(Array.from(savedArtworks)));
        localStorage.setItem('collections', JSON.stringify(collections));
        console.log("Local storage updated:", { savedArtworks: Array.from(savedArtworks), collections });
    }, [savedArtworks, collections]);

    //Need galleryNumber for Map feature and objectID for artwork render 
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5555/api/user-artworks/${user.username}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.artworks) {
                        const artworks = new Set(data.artworks.map(art => ({
                            objectID: art.objectID,
                            galleryNumber: art.galleryNumber
                        })));
                        setSavedArtworks(artworks);
                        console.log("Saved artworks fetched and set:", Array.from(artworks));
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch saved artworks:', error);
                    setSavedArtworks(new Set()); // Reset if fetch fails
                });
        } else {
            setSavedArtworks(new Set()); // Clear artworks on logout
        }
    }, [user]);

    const login = userData => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setSavedArtworks(new Set());
        setCollections([]);
    };

    const saveArtworkContext = useCallback(({ objectID, galleryNumber }) => {
        setSavedArtworks(prev => new Set([...prev, { objectID, galleryNumber }]));
    }, []);

    const removeArtworkContext = useCallback(objectID => {
        setSavedArtworks(prev => {
            const updated = new Set([...prev].filter(art => art.objectID !== objectID));
            return updated;
        });
    }, []);

    // Add a new collection + artwork to the collection POST 
    // called in ArtworkActions / using useAuth 
    const createCollection = async (collectionName, artworkData) => {
        // Prepare the data
        const collectionData = {
            name: collectionName,
            username: user.username,
            artworkId: artworkData.objectID,
            galleryNumber: artworkData.galleryNumber  // Include gallery number if your backend can process it
        };
    
        try {
            const newCollection = await addCollection(collectionData, user.id);
            if (newCollection && newCollection.artworks) {
                newCollection.artworks.push(artworkData);  // Manually add the artwork data if backend doesn't automatically return it in the collection
            }
            setCollections(prev => [...prev, newCollection]);
            console.log("Collection created successfully:", newCollection);
        } catch (error) {
            console.error("Error creating collection:", error);
        }
    };

    // const removeCollection = useCallback(collectionId => {
    //     setCollections(prev => prev.filter(coll => coll.id !== collectionId));
    // }, []);

    const addArtworkToCollection = (artworkId, collectionName) => {
        setCollections(prev => {
            const index = prev.findIndex(coll => coll.name === collectionName);
            if (index !== -1) {
                return prev.map((coll, i) => i === index ? { ...coll, artworks: [...coll.artworks, artworkId] } : coll);
            }
            return [...prev, { name: collectionName, artworks: [artworkId] }];
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            logout,
            savedArtworks,
            setSavedArtworks,
            updateSavedArtworks: setSavedArtworks,
            collections,
            saveArtworkContext,
            removeArtworkContext,
            createCollection,
            addArtworkToCollection
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);