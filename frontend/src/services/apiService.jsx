const BASE_URL = 'http://localhost:5555/api';

async function fetchWithErrors(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || response.statusText || "global fetch error");
    }
    return response.json();
}

// ARTWORK API REQUESTS
export const getArtworksByGalleryNumber = async (galleryNumber) => {
    const url = `${BASE_URL}/artworks/${galleryNumber}`;
    return fetchWithErrors(url, { method: 'GET' });
};

export const getArtworkById = async (objectID) => {
    const url = `${BASE_URL}/artworks/by-id/${objectID}`;
    return fetchWithErrors(url, { method: 'GET' });
};

export const saveArtwork = async (artworkData, userId) => {
    const url = `${BASE_URL}/saved-artworks`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId,
            object_id: artworkData.objectID
        })
    };
    return fetchWithErrors(url, options);
};

export const markArtworkAsInactive = async (objectID, userId) => {
    const url = `${BASE_URL}/saved-artworks/${objectID}`;
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'User-ID': userId 
        },
        body: JSON.stringify({ isActive: false }) 
    };
    return fetchWithErrors(url, options);
};

// COLLECTION API REQUESTS

// AllSaved 
export const getSavedArtworksByUserId = async (userId) => {
    const url = `${BASE_URL}/saved-artworks/${userId}`;
    return fetchWithErrors(url, { method: 'GET' });
};

//Add object to Collection
export const addArtworkToCollection = async (collectionName, artworkId, userId) => {
    const url = `${BASE_URL}/collections/add`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            collectionName: collectionName,
            artworkId: artworkId,
            userId: userId
        })
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Failed to add artwork to collection: ' + errorText);
        }
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};


//Crate a new Collection
export const addCollection = async (collectionData) => {
    const url = `${BASE_URL}/collections`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-ID': collectionData.user_id 
        },
        body: JSON.stringify(collectionData)
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to create collection: ' + await response.text());
        }
        return response; // Ensure that the response is a fetch Response object
    } catch (error) {
        console.error('API call failed:', error);
        throw error;  // Re-throw to handle it in the component
    }
};

//Get all Collections of User
export const getCollectionsByUserId = async (userId) => {
    const url = `${BASE_URL}/collections/${userId}`;
    try {
        const response = await fetchWithErrors(url, { method: 'GET' });
        return response; 
    } catch (error) {
        console.error('Failed at fetch collections:', error);
    }
};

//Get all Artworks of Collection ID
export const getArtworksByCollectionId = async (collectionId) => {
    const url = `${BASE_URL}/collections/${collectionId}/artworks`;
    try {
        const response = await fetchWithErrors(url, { method: 'GET' });
        return response;  
    } catch (error) {
        console.error('Failed to fetch artworks for collection:', error);
        throw error;  
    }
};


export const getHighlightedGalleries = async (userId, collectionId = null) => {
    const url = new URL(`${BASE_URL}/highlighted-galleries`);
    url.searchParams.append('user_id', userId);
    if (collectionId !== null) {
        url.searchParams.append('collection_id', collectionId);
    }

    return fetchWithErrors(url.toString(), { method: 'GET' });
};

export const deleteCollection = async (collectionId, userId) => {
    const url = `${BASE_URL}/collections/${collectionId}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'User-ID': userId
        }
    };
    return fetchWithErrors(url, options);
};

// SCAVENGER HUNT API REQUESTS
export const fetchScavengerHunt = async () => {
    const url = `${BASE_URL}/scavenger-hunt`;
    return fetchWithErrors(url, { method: 'GET' });
};

export const saveScavengerHuntAsCollection = async (userId, objectIds) => {
    const url = `${BASE_URL}/save-scavenger-hunt`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-ID': userId
        },
        body: JSON.stringify({ user_id: userId, object_ids: objectIds })
    };
    console.log("Saving Scavenger Hunt as Collection:", options);
    return fetchWithErrors(url, options);
};


//Used at Search Component on mount 
export const fetchRandomArtworks = async (count = 16) => {
    const url = `${BASE_URL}/random-artworks?count=${count}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return fetchWithErrors(url, options);
};