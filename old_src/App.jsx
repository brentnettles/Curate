import { useState } from 'react'

import Floorplan from '../client/frontend/src/Floorplan';

import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Metro Museum Floorplan</h1>
        <Floorplan />
      </header>
    </div>
  );
}

export default App
