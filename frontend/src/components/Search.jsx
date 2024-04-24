import React, { useState } from 'react';
import '../Style/search.css';  // Assuming the Style folder is at the root of src

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [department, setPriceRange] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (event) => {
        event.preventDefault();
        // Assume fetchResults function performs the search based on state variables
        fetchResults();
    };

    const fetchResults = () => {
        // Dummy fetch results
        setResults([
            { id: 1, title: "Artwork 1", description: "Description of Artwork 1" },
            { id: 2, title: "Artwork 2", description: "Description of Artwork 2" }
            // Add more dummy data as needed
        ]);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="search-select">
                    <option value="">Select Category</option>
                    <option value="painting">Painting</option>
                    <option value="sculpture">Sculpture</option>
                </select>
                <input
                    type="text"
                    placeholder="Date Range"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="search-date"
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="search-price"
                />
                <button type="submit" className="search-button">Search</button>
            </form>
            <div className="results">
                {results.map((item) => (
                    <div key={item.id} className="result-item">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Search;
