import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Function to determine the class name based on active state
    const getNavLinkClass = ({ isActive }) => {
        return isActive ? "nav-link active-link" : "nav-link";
    };

    return (
        <div className="navbar">
            <div className="navbar-items">
                <NavLink to="/" className={getNavLinkClass}>MAP</NavLink>
                <NavLink to="/search" className={getNavLinkClass}>SEARCH</NavLink>
                <NavLink to="/collections" className={getNavLinkClass}>SAVED COLLECTIONS</NavLink>
                <NavLink to="/discover" className={getNavLinkClass}>DISCOVER</NavLink>
            </div>
            {user ? (
                <button onClick={handleLogout} className="logout-button">Logout</button>
            ) : (
                <NavLink to="/login" className={getNavLinkClass}>Login</NavLink>
            )}
        </div>
    );
}

export default Navbar;
