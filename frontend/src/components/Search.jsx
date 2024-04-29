import React, { useState, useEffect } from 'react';
import '../Style/search.css';
import departments from '../departments.json'; 

function Search() {
    const [searchTerm, setSearchTerm] = useState([]);
    const [isHighlight, setIsHighlight] = useState(false);
    const [isOnView, setIsOnView] = useState(false);
    const [departmentId, setDepartmentId] = useState('');
    const [results, setResults] = useState([]);
    const [fetchLimit, setFetchLimit] = useState(25); // Initially fetch 25 
    const [searchType, setSearchType] = useState('artistCulture'); 

    useEffect(() => {
        fetchResults();  
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();
        await fetchResults();
    };

    const handleFilterChange = () => {
        setFetchLimit(25); 
        fetchResults();
    };

    const handleSeeMore = async () => {
        setFetchLimit(prevLimit => prevLimit + 12);  
        fetchResults();
    };

    const fetchResults = async () => {
        const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search';
        const url = new URL(baseUrl);
        if (searchType === 'medium') {
            url.searchParams.append('medium', searchTerm);
        } else {
            url.searchParams.append('q', searchTerm);
            if (isHighlight) url.searchParams.append('isHighlight', 'true');
            if (isOnView) url.searchParams.append('isOnView', 'true');
            if (departmentId) url.searchParams.append('departmentId', departmentId);
        }
    
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(`Total IDs fetched: ${data.objectIDs ? data.objectIDs.length : 0}`);
    
            if (data.objectIDs && data.objectIDs.length) {
                const objectIDs = data.objectIDs.slice(0, fetchLimit);  
    
                const details = await Promise.all(
                    objectIDs.map(id =>
                        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
                        .then(response => response.json())
                    )
                );
    
                const filteredDetails = details.filter(item => item.primaryImageSmall);
                setResults(filteredDetails);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error('Failed to fetch artworks:', error);
            setResults([]);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
                <select
                    value={searchType}
                    onChange={e => { setSearchType(e.target.value); handleFilterChange(); }}
                    className="search-type-select"
                >
                    <option value="artistCulture">Search by Artist / Culture</option>
                    <option value="medium">Search by Medium</option>
                </select>
                <input
                    type="text"
                    placeholder={searchType === 'medium' ? 'Enter Medium' : 'Search...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-button">Search</button>
            </form>
            <div className="filter-row">
            <select
                    value={departmentId}
                    onChange={(e) => { setDepartmentId(e.target.value); handleFilterChange(); }}
                    className="filter-department-select"
                    disabled={searchType === 'medium'}
                >
                    <option value="">Filter by Department</option>
                    {departments.departments.map((dept) => (
                        <option key={dept.departmentId} value={dept.departmentId}>
                            {dept.displayName}
                        </option>
                ))}
            </select>
                <label className="filter-highlight-checkbox">
                    <input
                        type="checkbox"
                        checked={isHighlight}
                        onChange={(e) => { setIsHighlight(e.target.checked); handleFilterChange(); }}
                        disabled={searchType === 'medium'}
                    />
                    Filter by is Highlight
                </label>
                <label className="filter-onview-checkbox">
                    <input
                        type="checkbox"
                        checked={isOnView}
                        onChange={(e) => { setIsOnView(e.target.checked); handleFilterChange(); }}
                        disabled={searchType === 'medium'} 
                    />
                    Filter by is On View
                </label>
            </div>
            <div className="results">
                {results.map((item) => (
                    <div key={item.objectID} className="result-item">
                        <img src={item.primaryImageSmall} alt={item.title} className="artwork-image" />
                        <h3>{item.title}</h3>
                        <p>{item.artistDisplayName}</p>
                    </div>
                ))}
            </div>
            {results.length > 0 && (
                <button onClick={handleSeeMore} className="search-button see-more-button">See More</button>
            )}
        </div>
    );
}

export default Search;
