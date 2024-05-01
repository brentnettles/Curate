import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [savedArtworks, setSavedArtworks] = useState(() => {
        const loadedArtworks = localStorage.getItem('savedArtworks');
        return new Set(loadedArtworks ? JSON.parse(loadedArtworks) : []);
    });

    const [collections, setCollections] = useState(() => {
        const loadedCollections = localStorage.getItem('collections');
        return loadedCollections ? JSON.parse(loadedCollections) : [];
    });

    useEffect(() => {
        localStorage.setItem('savedArtworks', JSON.stringify(Array.from(savedArtworks)));
        localStorage.setItem('collections', JSON.stringify(collections));
    }, [savedArtworks, collections]);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('savedArtworks');
        localStorage.removeItem('collections');
        setUser(null);
        setSavedArtworks(new Set());
        setCollections([]); // Ensure this is reset to an empty array
    };

    const saveArtworkContext = (objectID) => {
        setSavedArtworks(prev => new Set([...prev, objectID]));
    };

    const removeArtworkContext = (objectID) => {
        setSavedArtworks(prev => {
            const updatedArtworks = new Set([...prev]);
            updatedArtworks.delete(objectID);
            return updatedArtworks;
        });
    };

    const createCollection = (name) => {
        setCollections(prev => {
            if (!prev.find(c => c.name === name)) {
                console.log("Collection created:", name); // Log when a new collection is created
                return [...prev, { name, artworks: [] }];
            }
            return prev;
        });
    };

    const addArtworkToCollection = (artworkId, collectionName) => {
        setCollections(prev => {
            const index = prev.findIndex(coll => coll.name === collectionName);
            if (index !== -1) {
                // Update existing collection
                console.log("Artwork added to collection:", collectionName, "Artwork ID:", artworkId); // Log when artwork is added
                return prev.map((coll, i) => i === index ? { ...coll, artworks: [...coll.artworks, artworkId] } : coll);
            } else {
                // Add new collection
                console.log("Creating new collection and adding artwork:", collectionName, "Artwork ID:", artworkId); // Log when creating and adding
                return [...prev, { name: collectionName, artworks: [artworkId] }];
            }
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            savedArtworks,
            collections,
            saveArtworkContext,
            addArtworkToCollection,
            createCollection,
            removeArtworkContext
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
