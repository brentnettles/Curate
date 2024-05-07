import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    getCollectionsByUserId,
    markArtworkAsInactive,
    getSavedArtworksByUserId
} from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [savedArtworks, setSavedArtworks] = useState(() => {
        const data = JSON.parse(localStorage.getItem('savedArtworks') || '[]');
        return data;  // Use an array directly from storage
    });
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        localStorage.setItem('savedArtworks', JSON.stringify(savedArtworks));
        localStorage.setItem('collections', JSON.stringify(collections));
    }, [savedArtworks, collections]);

    useEffect(() => {
        if (user) {
            getSavedArtworksByUserId(user.id)
                .then(data => {
                    if (data && data.artworks) {
                        setSavedArtworks(data.artworks.map(art => ({
                            objectID: art.objectID,
                            galleryNumber: art.galleryNumber,
                            isActive: true
                        })));
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch saved artworks:', error);
                });

            getCollectionsByUserId(user.id)
                .then(response => {
                    const fetchedCollections = response.collections || [];
                    setCollections(fetchedCollections.map(collection => ({
                        ...collection,
                        artworks: collection.artworks.filter(art => art.isActive)
                    })));
                })
                .catch(error => {
                    console.error('Failed to fetch collections:', error);
                });
        } else {
            setSavedArtworks([]);
            setCollections([]);
        }
    }, [user]);

    const login = useCallback((userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.clear();
        setUser(null);
        setSavedArtworks([]);
        setCollections([]);
    }, []);

    const saveArtworkContext = useCallback(({ objectID, galleryNumber }) => {
        setSavedArtworks(prev => [...prev, { objectID, galleryNumber, isActive: true }]);
    }, []);

    const removeArtworkContext = useCallback((objectID) => {
        setSavedArtworks(prev => prev.filter(art => art.objectID !== objectID));
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            logout,
            savedArtworks,
            setSavedArtworks,
            collections,
            setCollections,
            saveArtworkContext,
            removeArtworkContext
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
