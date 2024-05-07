// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Map from './components/Map';
import ArtworkDetail from './components/ArtworkDetail';
import ArtworkList from './components/ArtworkList';
import Search from './components/Search';
import CollectionsPage from './components/CollectionsPage'; // Renamed from UserPage
import Login from './components/Login';
import Discover from './components/Discover';
// import Landing from './components/Landing'; 

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Map />}>
                    <Route path="artwork-list" element={<ArtworkList />} />
                </Route>
                <Route path="artwork/:id" element={<ArtworkDetail />} />
                {/* <Route path="landing" element={<Landing />} /> */}
                <Route path="search" element={<Search />} />
                <Route path="collections" element={
                    <ProtectedRoute>
                        <CollectionsPage />
                    </ProtectedRoute>
                } />
                <Route path="discover" element={
                    <ProtectedRoute>
                        <Discover/>
                    </ProtectedRoute>
                } />
                <Route path="login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
