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
                <Route path="search" element={<Search />} />
                <Route path="collections" element={
                    <ProtectedRoute>
                        <CollectionsPage />
                    </ProtectedRoute>
                } />
                <Route path="login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;


//Test build routes / troubleshooting User State////////////////////////////

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

