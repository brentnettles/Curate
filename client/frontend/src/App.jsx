import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react'
import Floorplan from './Floorplan';

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>theMET MAP</h2>;
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/floorplan">Floorplan</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/floorplan" element={<Floorplan />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;

