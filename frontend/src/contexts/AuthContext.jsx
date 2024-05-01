import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [savedArtworks, setSavedArtworks] = useState(() => {
        // Read the saved artworks from local storage
        const loadedArtworks = localStorage.getItem('savedArtworks');
        return new Set(loadedArtworks ? JSON.parse(loadedArtworks) : []);
    });

    useEffect(() => {
        // Log the current state / debugging
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
        setSavedArtworks(new Set()); // update artworks state
        console.log("Logged out, user set to null, and artworks cleared");
    };

    const saveArtworkContext = (objectID) => {

        setSavedArtworks(prev => new Set([...prev, objectID]));
    };

    const removeArtworkContext = (objectID) => {
        setSavedArtworks(prev => {
            const updatedArtworks = new Set([...prev]);
            updatedArtworks.delete(objectID);
            console.log("Before removal:", Array.from(prev)); // Log before removal
            console.log("After removal:", Array.from(updatedArtworks)); // Log after removal
            return updatedArtworks;
        });
    };

    return (
        <AuthContext.Provider value={{
            user, 
            login, 
            logout, 
            savedArtworks, 
            saveArtworkContext, 
            removeArtworkContext
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
