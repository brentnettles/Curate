// apiService.jsx - Goal is to keep the majority of the API request here ~
const BASE_URL = 'http://localhost:5555/api';

// TESTING Setup one function to handle errors for request to backend
async function fetchWithErrors(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || response.statusText);
    }
    return response.json(); 
}

// Backend delete artwork function
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

// Backend save artwork function
export const saveArtwork = async (artworkData, userId) => {
    const url = `${BASE_URL}/user-to-view`; 
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-ID': userId
        },
        body: JSON.stringify(artworkData)
    }; //testing
    return fetchWithErrors(url, options); 
};