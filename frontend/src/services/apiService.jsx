const BASE_URL = 'http://localhost:5555/api';

async function fetchWithErrors(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || response.statusText || "An unexpected error occurred");
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


export const addArtworkToCollection = async (collectionId, artwork) => {
    const url = `${BASE_URL}/collections/${collectionId}/artworks`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            artworkId: artwork.objectID,
            galleryNumber: artwork.galleryNumber
        })
    };
    return fetchWithErrors(url, options);
};

export const addCollection = async (collectionData) => {
    const url = `${BASE_URL}/collections`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-ID': collectionData.user_id // Assuming the user ID is needed in the headers
        },
        body: JSON.stringify(collectionData)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to create collection: ' + await response.text());
    }
    return response; // Return the raw response for further processing
};

export const getCollectionsByUserId = async (userId) => {
    const url = `${BASE_URL}/collections/${userId}`;
    return fetchWithErrors(url, { method: 'GET' });
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
    return fetchWithErrors(url, options);
};
