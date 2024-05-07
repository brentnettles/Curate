import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="navbar">
            <Link to="/">MAP</Link>
            <Link to="/search">SEARCH</Link>
            <Link to="/collections">SAVED COLLECTIONS</Link>  
            <Link to="/discover">DISCOVER</Link>  
            {/* <Link to="/landing">Landing</Link>   */}
            {user ? (
                <button onClick={handleLogout} className="logout-button">Logout</button>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </div>
    );
}

export default Navbar;
