import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
//   addCollection,
  getCollectionsByUserId,
  markArtworkAsInactive,
  getSavedArtworksByUserId
} from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        console.log("Loading user from localStorage:", savedUser);
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [savedArtworks, setSavedArtworks] = useState(() => {
        const data = JSON.parse(localStorage.getItem('savedArtworks') || '[]');
        return data.reduce((acc, item) => {
            acc[item.objectID] = {...item, isActive: true}; 
            return acc;
        }, {});
    });
    
    const login = async (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        try {
            const savedArtworksResponse = await getSavedArtworksByUserId(userData.id);
            const artworkState = savedArtworksResponse.reduce((acc, artwork) => {
                acc[artwork.objectID] = {...artwork, isActive: true};
                return acc;
            }, {});
            setSavedArtworks(artworkState);
            localStorage.setItem('savedArtworks', JSON.stringify(Object.values(artworkState)));
        } catch (error) {
            console.error("Error fetching saved artworks:", error);
        }
    };
    
    
    const logout = () => {
        console.log("User logged out");
        localStorage.clear();
        setUser(null);
        setSavedArtworks({});
        setCollections([]);
    };
   
    const [collections, setCollections] = useState([]);

    const handleGetCollections = useCallback(async (userId) => {
        console.log("Fetching collections for user:", userId);
        try {
            const response = await getCollectionsByUserId(userId);
            const fetchedCollections = response.collections || [];
            console.log("Collections fetched:", fetchedCollections);
            setCollections(fetchedCollections.map(collection => ({
                ...collection,
                artworks: collection.artworks.filter(artwork => artwork.isActive)
            })));
        } catch (error) {
            console.error('Failed to fetch collections:', error);
            setCollections([]);
        }
    }, []); 
    

    useEffect(() => {
        console.log("Updating localStorage for savedArtworks and collections");
        localStorage.setItem('savedArtworks', JSON.stringify(Object.values(savedArtworks)));
        localStorage.setItem('collections', JSON.stringify(collections));
    }, [savedArtworks, collections]);

    useEffect(() => {
        if (user) {
            console.log("User is set, fetching collections for user ID:", user.id);
            handleGetCollections(user.id);
        }
    }, [user]);

    const saveArtworkContext = useCallback(({ objectID, galleryNumber }) => {
        console.log("Saving artwork context:", objectID, galleryNumber);
        setSavedArtworks(prev => {
            const updatedArtworks = {
                ...prev,
                [objectID]: { objectID, galleryNumber, isActive: true }
            };
            localStorage.setItem('savedArtworks', JSON.stringify(Object.values(updatedArtworks)));
            return updatedArtworks;
        });
    }, []);
    
    const removeArtworkContext = useCallback(async (objectID) => {
        if (!user) return;  // Check user is not null
        const previousState = { ...savedArtworks[objectID] };  
        
        // Optimistically update UI
        setSavedArtworks(prev => {
            const updatedArtworks = {
                ...prev,
                [objectID]: { ...prev[objectID], isActive: false }
            };
            localStorage.setItem('savedArtworks', JSON.stringify(Object.values(updatedArtworks)));
            return updatedArtworks;
        });
    
        try {
            await markArtworkAsInactive(objectID, user.id);
        } catch (error) {
            console.error('Failed to mark artwork as inactive:', error);
            // Rollback to previous state if API call fails
            setSavedArtworks(prev => ({
                ...prev,
                [objectID]: previousState
            }));
        }
    }, [user, savedArtworks]);

    const [artworkCollectionMap, setArtworkCollectionMap] = useState(() => {
        return JSON.parse(localStorage.getItem('artworkCollectionMap') || '{}');
    });
    
    const updateArtworkCollectionMap = (artworkId, collectionId) => {
        const updatedMap = { ...artworkCollectionMap, [artworkId]: collectionId };
        setArtworkCollectionMap(updatedMap);
        localStorage.setItem('artworkCollectionMap', JSON.stringify(updatedMap));
    };

    const [toggleStates, setToggleStates] = useState({});

    // "+/-" button toggles the visibility of the collection
    const toggleCollectionVisibility = async (collectionId, artworkId) => {
        const currentKey = `${collectionId}-${artworkId}`;
        const isActive = toggleStates[currentKey];
        setToggleStates(prev => ({ ...prev, [currentKey]: !isActive }));
    
        if (!isActive) {
            try {
                console.log(`Adding artwork ${artworkId} to collection ${collectionId}`);
                await addArtworkToCollection(collection.name, artworkId, user.id);
            } catch (error) {
                console.error('Error adding artwork to collection:', error);
            }
        } else {
            try {
                console.log(`Marking artwork ${artworkId} as inactive in collection ${collectionId}`);
                await markArtworkAsInactive(artworkId, user.id);
            } catch (error) {
                console.error('Error marking artwork as inactive:', error);
            }
        }
    };
    

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
            removeArtworkContext,
            handleGetCollections,
            toggleStates,
            setToggleStates,
            toggleCollectionVisibility,
            updateArtworkCollectionMap
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
