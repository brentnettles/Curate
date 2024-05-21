import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCollectionsByUserId, getSavedArtworksByUserId, saveArtwork, markArtworkAsInactive } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [savedArtworks, setSavedArtworks] = useState(() => {
        const saved = JSON.parse(localStorage.getItem('savedArtworks'));
        console.log('Initial savedArtworks from localStorage:', saved);
        return saved || [];
    });
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        if (user) {
            fetchSavedArtworks();
            fetchCollections();
        } else {
            setSavedArtworks([]);
            setCollections([]);
        }
    }, [user]);

    const fetchSavedArtworks = async () => {
        try {
            const data = await getSavedArtworksByUserId(user.id);
            if (data && data.length) {
                const artworks = data.map(art => ({
                    ...art,
                    isActive: art.is_active // Ensure is_active is mapped to isActive
                }));
                setSavedArtworks(artworks);
                localStorage.setItem('savedArtworks', JSON.stringify(artworks)); // Persist to local storage
                console.log('Fetched and saved artworks:', artworks);
            }
        } catch (error) {
            console.error('Failed to fetch saved artworks:', error);
        }
    };

    const fetchCollections = async () => {
        try {
            const data = await getCollectionsByUserId(user.id);
            setCollections(data.collections || []);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        }
    };

    const saveArtworkContext = useCallback(async (artworkData) => {
        if (user && user.id) {
            try {
                await saveArtwork(artworkData, user.id);
                setSavedArtworks(prev => {
                    const updated = [...prev, { ...artworkData, isActive: true }];
                    localStorage.setItem('savedArtworks', JSON.stringify(updated)); // Persist to local storage
                    console.log('Updated savedArtworks after saving:', updated);
                    return updated;
                });
            } catch (error) {
                console.error('Error saving artwork:', error);
            }
        }
    }, [user?.id]);

    const removeArtworkContext = useCallback(async (objectID) => {
        if (user && user.id) {
            try {
                await markArtworkAsInactive(objectID, user.id);
                setSavedArtworks(prev => {
                    const updated = prev.map(art => 
                        art.objectID === objectID ? { ...art, isActive: false } : art
                    );
                    localStorage.setItem('savedArtworks', JSON.stringify(updated)); // Persist to local storage
                    console.log('Updated savedArtworks after removing:', updated);
                    return updated;
                });
            } catch (error) {
                console.error('Error removing artwork:', error);
            }
        }
    }, [user?.id]);

    const login = useCallback((userData, navigate) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        navigate('/');
    }, []);

    const logout = useCallback((navigate) => {
        localStorage.removeItem('user');
        setUser(null);
        setSavedArtworks([]);
        setCollections([]);
        navigate('/login');
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            savedArtworks,
            setSavedArtworks,
            saveArtworkContext,
            removeArtworkContext,
            fetchSavedArtworks,
            collections,
            setCollections,
            fetchCollections,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
