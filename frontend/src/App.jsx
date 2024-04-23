import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext'; // Make sure this import path is correct
import Navbar from './components/Navbar';
import Map from './components/Map'; // Main map view, public
import ArtworkDetail from './components/ArtworkDetail'; // Detail view for each artwork, should be public or protected based on your preference
import ArtworkList from './components/ArtworkList'; // Possibly inside Map or a separate route if needed
import Search from './components/Search'; // Search functionality, public or protected
import Hunt from './components/Hunt'; // Scavenger Hunt, protected
import UserPage from './components/UserPage'; // User's personal page, protected
import Login from './components/Login'; // Login page, public

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
                    {/* Nested route for ArtworkList if it's displayed within the Map */}
                    <Route path="artwork-list" element={<ArtworkList />} />
                </Route>
                <Route path="artwork/:id" element={<ArtworkDetail />} />
                <Route path="search" element={<Search />} />
                <Route path="hunt" element={
                    <ProtectedRoute>
                        <Hunt />
                    </ProtectedRoute>
                } />
                <Route path="user" element={
                    <ProtectedRoute>
                        <UserPage />
                    </ProtectedRoute>
                } />
                <Route path="login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;




// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { useState } from 'react'
// import Floorplan from './Floorplan';

// function Home() {
//   return <h2>Home</h2>;
// }

// function About() {
//   return <h2>theMET MAP</h2>;
// }

// function App() {
//   return (
//     <Router>
//       <div>
//         <nav>
//           <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/floorplan">Floorplan</Link>
//         </nav>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/floorplan" element={<Floorplan />} />
//           //add more Routes
          
//         </Routes>
//       </div>
//     </Router>
//   );
// }



// export default App;

