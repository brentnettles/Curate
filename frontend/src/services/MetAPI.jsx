const API_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

async function searchArtworks({ searchTerm, isHighlight, isOnView, departmentId, searchType }, fetchLimit) {
    const url = new URL(`${API_BASE_URL}/search`);
    url.searchParams.append('q', searchTerm);

    if (isHighlight) url.searchParams.append('isHighlight', 'true');
    if (isOnView) url.searchParams.append('isOnView', 'true');
    if (departmentId) url.searchParams.append('departmentId', departmentId);

    try {
        const response = await fetch(url.toString());
        const data = await response.json();
        if (data.objectIDs && data.objectIDs.length) {
            return fetchArtworkDetails(data.objectIDs.slice(0, fetchLimit));
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch search results:', error);
        throw new Error('API request failed');
    }
}

async function fetchArtworkDetails(objectIDs) {
    const promises = objectIDs.map(id =>
        fetch(`${API_BASE_URL}/objects/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.isPublicDomain) return data;
                return null;
            })
            .catch(error => {
                console.error(`Failed to fetch details for object ${id}:`, error);
                return null;
            })
    );
    const details = await Promise.all(promises);
    return details.filter(item => item); // Filter out any null responses due to errors
}

export { searchArtworks, fetchArtworkDetails };
