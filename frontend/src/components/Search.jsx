import React, { useState, useEffect } from 'react';
import '../Style/search.css';
import departmentsData from '../departments.json'; 
import { searchArtworks } from '../services/MetAPI';
//function to load random artworks on load for CURATE db
import { fetchRandomArtworks } from '../services/apiService';  

function Search() {
    const [queryParams, setQueryParams] = useState({
        searchTerm: '',
        isHighlight: false,
        isOnView: false,
        departmentId: '',
        searchType: 'artistCulture'
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLimit, setFetchLimit] = useState(10);

    const departments = departmentsData.departments;

    useEffect(() => {
        // Load random artworks on component mount
        loadRandomArtworks();
    }, []);

    const loadRandomArtworks = async () => {
        setLoading(true);
        try {
            const response = await fetchRandomArtworks(); // Calls the API to fetch artworks
            if (response && Array.isArray(response.artworks)) {
                console.log('Random artworks loaded:', response.artworks);
                setResults(response.artworks);
            } else {
                throw new Error('Received data is not in expected format');
            }
        } catch (error) {
            console.error('Failed to load random artworks:', error);
            setResults([]); // Set results to an empty array on error
        } finally {
            setLoading(false);
        }
    };

    const fetchArtworks = async (params, limit) => {
        console.log('Fetching parameters:', params, 'Limit:', limit);
        setLoading(true);
        try {
            const newResults = await searchArtworks(params, limit);
            console.log('Fetched data:', newResults);
            setResults(newResults);
        } catch (error) {
            console.error('Error fetching artworks:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        fetchArtworks(queryParams, fetchLimit);
    };

    const handleFilterChange = (newParams) => {
        setQueryParams(prev => {
            const updatedParams = { ...prev, ...newParams };
            console.log('Updated query parameters:', updatedParams);
            return updatedParams;
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            fetchArtworks(queryParams, fetchLimit);
        }
    };

    const handleSeeMore = () => {
        setFetchLimit(prev => prev + 10);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
                <select
                    value={queryParams.searchType}
                    onChange={(e) => handleFilterChange({ searchType: e.target.value })}
                    className="search-type-select"
                >
                    <option value="artistCulture">Search by Artist / Culture</option>
                    <option value="medium">Search by Medium</option>
                </select>
                <input
                    type="text"
                    placeholder={queryParams.searchType === 'medium' ? 'Enter Medium' : 'Search...'}
                    value={queryParams.searchTerm}
                    onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
                    onKeyDown={handleKeyDown}
                    className="search-input"
                />
                <button type="submit" className="search-button">Search</button>
            </form>
            <div className="filter-row">
                <select
                    value={queryParams.departmentId}
                    onChange={(e) => handleFilterChange({ departmentId: e.target.value })}
                    className="filter-department-select"
                >
                    <option value="">Filter by Department</option>
                    {departments.map(dept => (
                        <option key={dept.departmentId} value={dept.departmentId}>
                            {dept.displayName}
                        </option>
                    ))}
                </select>
                <label className="filter-highlight-checkbox">
                    <input
                        type="checkbox"
                        checked={queryParams.isHighlight}
                        onChange={(e) => handleFilterChange({ isHighlight: e.target.checked })}
                    />
                    Filter by is Highlight
                </label>
                <label className="filter-onview-checkbox">
                    <input
                        type="checkbox"
                        checked={queryParams.isOnView}
                        onChange={(e) => handleFilterChange({ isOnView: e.target.checked })}
                    />
                    Filter by is On View
                </label>
            </div>
            {loading ? <div className="loader"></div> : (
                <div className="results">
                    {results.map(item => (
                        <div key={item.objectID} className="result-item">
                            <img src={item.primaryImageSmall} alt={item.title} className="artwork-image" />
                            <h3 className='search-title'>{item.title}</h3>
                            <p className='search-Gallery-num'>Gallery {item.GalleryNumber}</p>
                            <p className='search-ArtistName'>{item.artistDisplayName}</p>
                        </div>
                    ))}
                </div>
            )}
            {results.length > 0 && (
                <button onClick={handleSeeMore} className="search-button see-more-button">See More</button>
            )}
        </div>
    );
}

export default Search;
