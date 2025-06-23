// import logo from './logo.svg';
// import './App.css';
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
// export default App;


// src/App.js
import React, { useEffect, useState } from 'react';
import RacesList from './components/RacesList.tsx';
import Chat from './components/Chat.tsx';

function App() {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    fetch('/api/races')
      .then((res) => res.json())
      .then((data) => setRaces(data));
  }, []);

  const confirmRace = async (raceId) => {
    await fetch(`/api/races/${raceId}/confirm`, { method: 'POST' });
    setRaces((prev) =>
      prev.map((race) =>
        race.id === raceId ? { ...race, completed: true } : race
      )
    );
  };

  return (
    <div className="container">
      <h1>Motokárová Hala – Správa Jázd</h1>
      <RacesList races={races} onConfirmRace={confirmRace} />
      <Chat />
    </div>
  );
}

export default App;
