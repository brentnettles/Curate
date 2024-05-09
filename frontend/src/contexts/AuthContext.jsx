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

    const refreshSavedArtworks = async () => {
        if (user && user.id) {
            try {
                const saved = await getSavedArtworksByUserId(user.id);
                setSavedArtworks(saved.map(art => ({ ...art, isActive: true })));
            } catch (error) {
                console.error('Failed to fetch saved artworks:', error);
            }
        }
    };

    const handleGetCollections = async () => {
        await refreshCollections();
    };

    const refreshCollections = async () => {
        if (user && user.id) {
            try {
                const data = await getCollectionsByUserId(user.id);
                setCollections(data.collections || []);
            } catch (error) {
                console.error('Failed to fetch collections:', error);
            }
        }
    };

    const saveArtworkContext = useCallback(async (artworkData) => {
        if (user && user.id) {
            try {
                await saveArtwork(artworkData, user.id);
                setSavedArtworks(prev => [...prev, { ...artworkData, isActive: true }]);
            } catch (error) {
                console.error('Error saving artwork:', error);
            }
        }
    }, [user?.id]);

    const removeArtworkContext = useCallback((objectID) => {
        setSavedArtworks(prev => prev.filter(art => art.objectID !== objectID || !art.isActive));
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
            refreshSavedArtworks,
            refreshCollections,
            saveArtworkContext,
            removeArtworkContext,
            handleGetCollections
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
