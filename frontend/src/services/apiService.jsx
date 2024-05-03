const BASE_URL = 'http://localhost:5555/api';

async function fetchWithErrors(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || response.statusText);
    }
    return response.json(); 
}

export const deleteArtwork = async (artworkId, userId) => {
    const url = `${BASE_URL}/user-to-view/${artworkId}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'User-ID': userId
        }
    };
    return fetchWithErrors(url, options);
};

export const saveArtwork = async (artworkData, userId) => {
    const url = `${BASE_URL}/user-to-view`; 
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-ID': userId
        },
        body: JSON.stringify(artworkData)
    };
    return fetchWithErrors(url, options); 
};

export const fetchScavengerHunt = async () => {
    const url = `${BASE_URL}/scavenger-hunt`;
    return fetchWithErrors(url, { method: 'GET' });
};

// Add a new collection
export const addCollection = async (collectionData, userId) => {
    const url = `${BASE_URL}/collections`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-ID': userId
        },
        body: JSON.stringify(collectionData)
    };
    return fetchWithErrors(url, options);
};

// Get all collections for a user
export const getCollectionsByUsername = async (username) => {
    const url = `${BASE_URL}/collections/${username}`;
    const response = await fetchWithErrors(url, { method: 'GET' });
    return response.collections; // Assuming the backend sends an object with a 'collections' array
};

// Add an artwork to a collection
export const addArtworkToCollection = async (collectionId, artworkId) => {
    const url = `${BASE_URL}/collections/${collectionId}/artworks`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ artworkId })
    };
    return fetchWithErrors(url, options);
};

// Delete Collection 
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
