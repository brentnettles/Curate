import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    console.log("User state in Navbar:", user); // Debug: Check user state on render

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    return (
        <div className="navbar">
            <Link to="/">Home/Map</Link>
            <Link to="/search">Search</Link>
            <Link to="/hunt">Scavenger Hunt</Link>
            <Link to="/user">User Page</Link>
            {user ? (
            <button onClick={handleLogout} className="logout-button">Logout</button>
            ) : (
    <Link to="/login">Login</Link>
        )}
        </div>
    );
}

export default Navbar;
