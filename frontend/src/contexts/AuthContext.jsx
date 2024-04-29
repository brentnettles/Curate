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

    useEffect(() => {
        // Log the current state of saved artworks for debugging
        console.log("Current saved artworks:", Array.from(savedArtworks));
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
        setSavedArtworks(new Set()); // Clear the artworks state
        console.log("Logged out, user set to null, and artworks cleared");
    };

    const saveArtwork = (galleryNumber) => {
        setSavedArtworks(prev => new Set([...prev, galleryNumber]));
    };

    const removeArtwork = (artworkId) => {
        setSavedArtworks(prevSavedArtworks => {
            const updatedArtworks = new Set(prevSavedArtworks);
            updatedArtworks.delete(artworkId);
            return updatedArtworks;
        });
        console.log("Artwork removed:", artworkId);
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