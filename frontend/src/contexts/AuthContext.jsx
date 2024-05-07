import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCollectionsByUserId, getSavedArtworksByUserId, saveArtwork } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [savedArtworks, setSavedArtworks] = useState([]);
    const [collections, setCollections] = useState([]);

    // Fetching initial data
    useEffect(() => {
        if (user) {
            refreshSavedArtworks();
            refreshCollections();
        } else {
            setSavedArtworks([]);
            setCollections([]);
        }
    }, [user]);

    const refreshSavedArtworks = async () => {
        try {
            const saved = await getSavedArtworksByUserId(user.id);
            setSavedArtworks(saved.map(art => ({ ...art, isActive: true })));
        } catch (error) {
            console.error('Failed to fetch saved artworks:', error);
        }
    };

    const refreshCollections = async () => {
        try {
            const data = await getCollectionsByUserId(user.id);
            setCollections(data.collections || []);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        }
    };

    const saveArtworkContext = useCallback(async (artworkData) => {
        try {
            await saveArtwork(artworkData, user.id);
            setSavedArtworks(prev => [...prev, { ...artworkData, isActive: true }]);
        } catch (error) {
            console.error('Error saving artwork:', error);
        }
    }, [user.id]);

    const removeArtworkContext = useCallback((objectID) => {
        setSavedArtworks(prev => prev.filter(art => art.objectID !== objectID || !art.isActive));
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            savedArtworks,
            setSavedArtworks,
            collections,
            setCollections,
            refreshCollections,
            saveArtworkContext,
            removeArtworkContext
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
