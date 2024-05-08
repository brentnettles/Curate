import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../../public/CUlogo.png'; // Adjust the path as necessary

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Company Logo" />
            </div>
            <div className="navbar-items">
                <NavLink to="/" className="nav-link" activeClassName="active-link">MAP</NavLink>
                <NavLink to="/search" className="nav-link" activeClassName="active-link">SEARCH</NavLink>
                <NavLink to="/collections" className="nav-link" activeClassName="active-link">SAVED COLLECTIONS</NavLink>
                <NavLink to="/discover" className="nav-link" activeClassName="active-link">DISCOVER</NavLink>
            </div>
            {user ? (
                <button onClick={handleLogout} className="logout-button">Logout</button>
            ) : (
                <NavLink to="/login" className="nav-link login-link">Login</NavLink>
            )}
        </div>
    );
}

export default Navbar;
