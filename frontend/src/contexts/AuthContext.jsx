import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [savedArtworks, setSavedArtworks] = useState(new Set()); // Manage saved artworks IDs

    useEffect(() => {
        // Load saved artworks from local storage or initialize if not present
        const loadedArtworks = JSON.parse(localStorage.getItem('savedArtworks')) || [];
        setSavedArtworks(new Set(loadedArtworks));
    }, []);

    useEffect(() => {
        // Save the savedArtworks to local storage whenever it changes
        localStorage.setItem('savedArtworks', JSON.stringify(Array.from(savedArtworks)));
    }, [savedArtworks]);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('savedArtworks'); 
        setUser(null);
        setSavedArtworks(new Set()); // Reset the artworks state
        console.log("Logged out, user set to null");
    };

    const saveArtwork = (artworkId) => {
        setSavedArtworks(new Set(savedArtworks.add(artworkId)));
    };

    const removeArtwork = (artworkId) => {
        savedArtworks.delete(artworkId);
        setSavedArtworks(new Set([...savedArtworks]));
    };

    return (
        <AuthContext.Provider value={{
            user, 
            login, 
            logout, 
            savedArtworks, 
            saveArtwork, 
            removeArtwork
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
