import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [collections, setCollections] = useState(() => {
        // TESTING NEW collections
        const loadedCollections = localStorage.getItem('collections');
        return loadedCollections ? JSON.parse(loadedCollections) : {};
    });

    const [savedArtworks, setSavedArtworks] = useState(() => {
        const loadedArtworks = localStorage.getItem('savedArtworks');
        return new Set(loadedArtworks ? JSON.parse(loadedArtworks) : []);
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
        setCollections({});
    };

    const saveArtworkContext = (objectID) => {
        setSavedArtworks(prev => new Set([...prev, objectID]));
    };

    const addToCollection = (artworkId, collectionName) => {
        setCollections(prev => ({
            ...prev,
            [collectionName]: [...(prev[collectionName] || []), artworkId]
        }));
    };

    const removeArtworkContext = (objectID) => {
        setSavedArtworks(prev => {
            const updatedArtworks = new Set([...prev]);
            updatedArtworks.delete(objectID);
            return updatedArtworks;
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
            addToCollection,
            removeArtworkContext
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);