// src/App.js
import React from 'react';
import RacesList from './components/RacesList.tsx';
import Chat from './components/Chat.tsx';

function App() {

  return (
    <div className="container">
      <h1>Motokárová hala – Správa Jázd</h1>
      <RacesList />
      <Chat />
    </div>
  );
}

export default App;
