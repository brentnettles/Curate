import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../../public/CUlogo.png'; // Adjust the path as necessary

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log("Logging out...");
        await logout();
        console.log("Logged out, navigating to home...");
        navigate('/');
    };

    
    return (
        <div className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Company Logo" />
            </div>
            <div className="navbar-items">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>MAP</NavLink>
                <NavLink to="/search" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>SEARCH</NavLink>
                <NavLink to="/collections" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>SAVED COLLECTIONS</NavLink>
                <NavLink to="/discover" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>DISCOVER</NavLink>
            </div>
            {user ? (
                <button onClick={handleLogout} className="logout-button">Logout</button>
            ) : (
                <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link login-link active-link" : "nav-link login-link"}>Login</NavLink>
            )}
        </div>
    );
}

export default Navbar;
